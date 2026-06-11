const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const City = require('./models/City');
const Route = require('./models/Route');
const TollPlaza = require('./models/TollPlaza');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const TollRecord = require('./models/TollRecord');

const citiesData = [
  { name: 'Delhi', location: { lat: 28.7041, lng: 77.1025 } },
  { name: 'Baghpat', location: { lat: 28.9427, lng: 77.2276 } },
  { name: 'Shamli', location: { lat: 29.4452, lng: 77.3060 } },
  { name: 'Saharanpur', location: { lat: 29.9640, lng: 77.5460 } },
  { name: 'Dehradun', location: { lat: 30.3165, lng: 78.0322 } }
];

const vehicleTypes = ['Car', 'Truck', 'Bus', 'Motorcycle', 'LCV'];

const seedDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/expressway');
    console.log('Connected to MongoDB');

    // Clear existing data
    await City.deleteMany({});
    await Route.deleteMany({});
    await TollPlaza.deleteMany({});
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await TollRecord.deleteMany({});

    // Seed Admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    await User.create({
      name: 'Admin',
      email: 'admin@expressway.com',
      password: hashedPassword,
      role: 'admin'
    });

    // Seed Cities
    const createdCities = await City.insertMany(citiesData);
    console.log('Cities seeded');

    const getCityId = (name) => createdCities.find(c => c.name === name)._id;

    const routesData = [
      { fromCity: getCityId('Delhi'), toCity: getCityId('Baghpat'), distance: 40, time: 45, baseToll: 50 },
      { fromCity: getCityId('Baghpat'), toCity: getCityId('Shamli'), distance: 65, time: 70, baseToll: 70 },
      { fromCity: getCityId('Shamli'), toCity: getCityId('Saharanpur'), distance: 70, time: 75, baseToll: 80 },
      { fromCity: getCityId('Saharanpur'), toCity: getCityId('Dehradun'), distance: 70, time: 90, baseToll: 100 },
      { fromCity: getCityId('Delhi'), toCity: getCityId('Saharanpur'), distance: 165, time: 180, baseToll: 200 }
    ];

    const createdRoutes = await Route.insertMany(routesData);
    console.log('Routes seeded');

    // Seed Toll Plazas
    const tollPlazasData = createdRoutes.map((route, index) => {
      const fromCity = createdCities.find(c => c._id.equals(route.fromCity));
      const toCity = createdCities.find(c => c._id.equals(route.toCity));
      return {
        name: `${fromCity.name}-${toCity.name} Toll Plaza`,
        location: { 
          lat: (fromCity.location.lat + toCity.location.lat) / 2,
          lng: (fromCity.location.lng + toCity.location.lng) / 2
        },
        route: route._id,
        rates: {
          Car: route.baseToll,
          Truck: route.baseToll * 3,
          Bus: route.baseToll * 2.5,
          Motorcycle: route.baseToll * 0.5,
          LCV: route.baseToll * 1.5
        }
      };
    });

    const createdPlazas = await TollPlaza.insertMany(tollPlazasData);
    console.log('Toll Plazas seeded');

    // Seed Vehicles
    const vehiclesData = [];
    for (let i = 0; i < 20; i++) {
      const state = ['DL', 'HR', 'UP', 'UK'][Math.floor(Math.random() * 4)];
      const num1 = Math.floor(Math.random() * 90) + 10;
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const charStr = chars[Math.floor(Math.random()*26)] + chars[Math.floor(Math.random()*26)];
      const num2 = Math.floor(Math.random() * 9000) + 1000;
      
      vehiclesData.push({
        vehicleNumber: `${state}-${num1}-${charStr}-${num2}`,
        ownerName: `Owner ${i+1}`,
        vehicleType: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
        status: Math.random() > 0.2 ? 'Active' : 'Inactive',
        currentRoute: createdRoutes[Math.floor(Math.random() * createdRoutes.length)]._id
      });
    }
    const createdVehicles = await Vehicle.insertMany(vehiclesData);
    console.log('Vehicles seeded');

    // Seed Toll Records
    const recordsData = [];
    for (let i = 0; i < 50; i++) {
      const v = createdVehicles[Math.floor(Math.random() * createdVehicles.length)];
      const p = createdPlazas[Math.floor(Math.random() * createdPlazas.length)];
      
      // Random date in past 7 days
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 7));
      date.setHours(Math.floor(Math.random() * 24));
      
      recordsData.push({
        vehicle: v._id,
        tollPlaza: p._id,
        amount: p.rates[v.vehicleType],
        timestamp: date
      });
    }
    await TollRecord.insertMany(recordsData);
    console.log('Toll Records seeded');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seedDB();
