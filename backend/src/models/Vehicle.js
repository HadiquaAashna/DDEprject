const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true, unique: true },
  ownerName: { type: String, required: true },
  vehicleType: { type: String, enum: ['Car', 'Truck', 'Bus', 'Motorcycle', 'LCV'], required: true },
  currentRoute: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
