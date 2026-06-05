// Load environment variables before running other logic
require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();

// Standard middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log requests to console
app.use((req, res, next) => {
  console.log(`[HTTP Request] ${req.method} ${req.url}`);
  next();
});

// API Routes mounting
app.use('/api/appointments', appointmentRoutes);

// Simple health/status check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Serve frontend static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
  });
} else {
  // 404 Fallback Handler
  app.use((req, res, next) => {
    res.status(404).json({ success: false, message: 'API endpoint not found' });
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Server Error]', err);
  res.status(500).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.',
  });
});

module.exports = app;
