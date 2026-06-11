const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  fromCity: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  toCity: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  distance: { type: Number, required: true }, // in km
  time: { type: Number, required: true }, // in minutes
  baseToll: { type: Number, required: true }, // in rupees
}, { timestamps: true });

// Ensure bidirectional routing could be added, but we'll treat them as directed or undirected in the DSA logic
module.exports = mongoose.model('Route', routeSchema);
