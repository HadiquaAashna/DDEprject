const express = require('express');
const router = express.Router();
const City = require('../models/City');

// Get all cities
router.get('/', async (req, res) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add a new city
router.post('/', async (req, res) => {
  try {
    const newCity = new City(req.body);
    await newCity.save();
    
    if (req.io) {
      req.io.emit('cityAdded', newCity);
    }
    
    res.status(201).json(newCity);
  } catch (error) {
    res.status(400).json({ message: 'Error adding city', error: error.message });
  }
});

// Update city
router.put('/:id', async (req, res) => {
  try {
    const city = await City.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!city) return res.status(404).json({ message: 'City not found' });
    
    if (req.io) {
      req.io.emit('cityUpdated', city);
    }
    
    res.json(city);
  } catch (error) {
    res.status(400).json({ message: 'Error updating city', error: error.message });
  }
});

// Delete city
router.delete('/:id', async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    if (!city) return res.status(404).json({ message: 'City not found' });
    
    if (req.io) {
      req.io.emit('cityDeleted', req.params.id);
    }
    
    res.json({ message: 'City deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting city', error: error.message });
  }
});

module.exports = router;
