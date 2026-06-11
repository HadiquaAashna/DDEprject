const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Mock login for demo purposes when MongoDB isn't available
  if (email === 'admin@expressway.com' && password === 'admin123') {
    const token = jwt.sign({ id: 'mock-user-id', role: 'admin' }, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' });
    return res.json({ token, user: { id: 'mock-user-id', name: 'Admin', email: 'admin@expressway.com', role: 'admin' } });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' });
    
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Admin (for testing)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new User({ name, email, password: hashedPassword, role: 'admin' });
    await user.save();
    res.json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
