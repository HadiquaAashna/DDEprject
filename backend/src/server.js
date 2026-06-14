require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const vehicleRoutes = require('./routes/vehicles');
const tollRoutes = require('./routes/tolls');
const dsaRoutes = require('./routes/dsa');
const analyticsRoutes = require('./routes/analytics');
const citiesRoutes = require('./routes/cities');
const roadsRoutes = require('./routes/roads');

const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Attach io to req object so routes can emit events
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/expressway').then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/tolls', tollRoutes);
app.use('/api/dsa', dsaRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/cities', citiesRoutes);
app.use('/api/roads', roadsRoutes);

app.get('/', (req, res) => {
  res.send('Smart Expressway Management System API is running...');
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
