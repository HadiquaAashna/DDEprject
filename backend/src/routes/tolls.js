const express = require('express');
const router = express.Router();
const TollPlaza = require('../models/TollPlaza');
const TollRecord = require('../models/TollRecord');
const Vehicle = require('../models/Vehicle');

// Get all toll plazas
router.get('/plazas', async (req, res) => {
  try {
    const plazas = await TollPlaza.find().populate('route');
    res.json(plazas);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add a new toll plaza
router.post('/plazas', async (req, res) => {
  try {
    const newPlaza = new TollPlaza(req.body);
    await newPlaza.save();
    
    if (req.io) {
      req.io.emit('tollPlazaAdded', newPlaza);
    }
    
    res.status(201).json(newPlaza);
  } catch (error) {
    res.status(400).json({ message: 'Error adding toll plaza', error: error.message });
  }
});

// Update toll plaza rates/details
router.put('/plazas/:id', async (req, res) => {
  try {
    const plaza = await TollPlaza.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plaza) return res.status(404).json({ message: 'Toll plaza not found' });
    
    if (req.io) {
      req.io.emit('tollPlazaUpdated', plaza);
    }
    res.json(plaza);
  } catch (error) {
    res.status(400).json({ message: 'Error updating toll plaza', error: error.message });
  }
});

// Delete toll plaza
router.delete('/plazas/:id', async (req, res) => {
  try {
    const plaza = await TollPlaza.findByIdAndDelete(req.params.id);
    if (!plaza) return res.status(404).json({ message: 'Toll plaza not found' });
    
    if (req.io) {
      req.io.emit('tollPlazaDeleted', req.params.id);
    }
    res.json({ message: 'Toll plaza deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting toll plaza', error: error.message });
  }
});

// Add a new toll record (vehicle passing through)
router.post('/record', async (req, res) => {
  try {
    const { vehicle, tollPlaza, amount } = req.body;
    
    const newRecord = new TollRecord({ vehicle, tollPlaza, amount });
    await newRecord.save();
    
    if (req.io) {
      req.io.emit('tollRecorded', newRecord);
      req.io.emit('dashboardUpdate'); 
    }
    
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(400).json({ message: 'Error adding toll record', error: error.message });
  }
});

// Get all toll records
router.get('/records', async (req, res) => {
  try {
    const records = await TollRecord.find()
      .populate('vehicle')
      .populate('tollPlaza')
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get total revenue
router.get('/revenue', async (req, res) => {
  try {
    const result = await TollRecord.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ]);
    res.json({ totalRevenue: result[0]?.totalRevenue || 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
