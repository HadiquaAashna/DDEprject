const mongoose = require('mongoose');

const tollPlazaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  rates: {
    Car: { type: Number, required: true },
    Truck: { type: Number, required: true },
    Bus: { type: Number, required: true },
    Motorcycle: { type: Number, required: true },
    LCV: { type: Number, required: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('TollPlaza', tollPlazaSchema);
