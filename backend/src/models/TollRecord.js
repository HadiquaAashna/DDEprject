const mongoose = require('mongoose');

const tollRecordSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  tollPlaza: { type: mongoose.Schema.Types.ObjectId, ref: 'TollPlaza', required: true },
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('TollRecord', tollRecordSchema);
