const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
// We can use the optional auth if we want, but for demo let's keep it open to easily test from frontend
// const auth = require('../middleware/auth'); 

// Get all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('currentRoute').sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching vehicles', error: error.message });
  }
});

// Get total count
router.get('/count', async (req, res) => {
  try {
    const count = await Vehicle.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching vehicle count', error: error.message });
  }
});

// Get single vehicle
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('currentRoute');
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add new vehicle
router.post('/', async (req, res) => {
  try {
    const newVehicle = new Vehicle(req.body);
    await newVehicle.save();
    
    // Emit socket event
    if (req.io) {
      req.io.emit('vehicleAdded', newVehicle);
      req.io.emit('dashboardUpdate'); // Trigger generic dashboard refresh
    }
    
    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(400).json({ message: 'Error adding vehicle', error: error.message });
  }
});

// Update vehicle
router.put('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    // Emit socket event
    if (req.io) {
      req.io.emit('vehicleUpdated', vehicle);
      req.io.emit('dashboardUpdate'); 
    }

    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ message: 'Error updating vehicle', error: error.message });
  }
});

// Delete vehicle
router.delete('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    // Emit socket event
    if (req.io) {
      req.io.emit('vehicleDeleted', req.params.id);
      req.io.emit('dashboardUpdate');
    }

    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting vehicle', error: error.message });
  }
});

module.exports = router;
