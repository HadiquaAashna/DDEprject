const express = require('express');
const router = express.Router();
const Route = require('../models/Route');

// Get all roads (routes)
router.get('/', async (req, res) => {
  try {
    const roads = await Route.find().populate('fromCity').populate('toCity');
    res.json(roads);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add a new road
router.post('/', async (req, res) => {
  try {
    const newRoad = new Route(req.body);
    await newRoad.save();
    
    // We should populate before emitting so the frontend gets the full object
    const populatedRoad = await Route.findById(newRoad._id).populate('fromCity').populate('toCity');
    
    if (req.io) {
      req.io.emit('routeAdded', populatedRoad);
    }
    
    res.status(201).json(populatedRoad);
  } catch (error) {
    res.status(400).json({ message: 'Error adding road', error: error.message });
  }
});

// Update road
router.put('/:id', async (req, res) => {
  try {
    const road = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('fromCity').populate('toCity');
    if (!road) return res.status(404).json({ message: 'Road not found' });
    
    if (req.io) {
      req.io.emit('routeUpdated', road);
    }
    
    res.json(road);
  } catch (error) {
    res.status(400).json({ message: 'Error updating road', error: error.message });
  }
});

// Delete road
router.delete('/:id', async (req, res) => {
  try {
    const road = await Route.findByIdAndDelete(req.params.id);
    if (!road) return res.status(404).json({ message: 'Road not found' });
    
    if (req.io) {
      req.io.emit('routeDeleted', req.params.id);
    }
    
    res.json({ message: 'Road deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting road', error: error.message });
  }
});

module.exports = router;
