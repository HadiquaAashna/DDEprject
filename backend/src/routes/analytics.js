const express = require('express');
const router = express.Router();
const TollRecord = require('../models/TollRecord');
const Vehicle = require('../models/Vehicle');
const Route = require('../models/Route');

// Get overall dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalVehicles = await Vehicle.countDocuments();
    const activeRoutes = await Route.countDocuments();
    
    // Total Revenue
    const tollResult = await TollRecord.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$amount" }, count: { $sum: 1 } } }
    ]);
    const totalRevenue = tollResult[0]?.totalRevenue || 0;
    const tollCollectionsCount = tollResult[0]?.count || 0;

    // Traffic Density (approx by active vehicles)
    const activeVehicles = await Vehicle.countDocuments({ status: 'Active' });
    let trafficDensityStr = 'Low';
    if (activeVehicles > 50) trafficDensityStr = 'Medium';
    if (activeVehicles > 200) trafficDensityStr = 'High';

    res.json({
      totalVehicles,
      activeRoutes,
      totalRevenue,
      tollCollections: tollCollectionsCount,
      trafficDensity: trafficDensityStr
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
});

// Get charts data
router.get('/charts', async (req, res) => {
  try {
    // 1. Vehicle Distribution Pie Chart
    const vehicleDist = await Vehicle.aggregate([
      { $group: { _id: "$vehicleType", value: { $sum: 1 } } }
    ]);
    
    // Map colors
    const colors = {
      'Car': '#3b82f6',
      'Truck': '#f59e0b',
      'Bus': '#10b981',
      'Motorcycle': '#8b5cf6',
      'LCV': '#ec4899'
    };
    
    const vehicleDistribution = vehicleDist.map(v => ({
      name: v._id,
      value: v.value,
      color: colors[v._id] || '#cbd5e1'
    }));

    // 2. Revenue Trends (last 7 days simplified)
    // We group by day
    const revenueDist = await TollRecord.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 10 }
    ]);

    const revenueData = revenueDist.map(r => ({
      date: r._id,
      total: r.total,
      transactions: r.count
    }));
    
    // 3. Traffic Volume (simulated over hours if not enough timestamp density)
    // Real implementation would aggregate records by hour
    
    res.json({
      vehicleDistribution: vehicleDistribution.length > 0 ? vehicleDistribution : [{name:'No Data', value: 1, color:'#334155'}],
      revenueData,
      trafficVolume: [] // Can be expanded
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching charts data', error: error.message });
  }
});

module.exports = router;
