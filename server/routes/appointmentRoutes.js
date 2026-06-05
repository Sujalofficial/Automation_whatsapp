const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Route for creating a new appointment and listing all appointments
router.route('/')
  .post(appointmentController.createAppointment)
  .get(appointmentController.getAppointments);

// Route for compiling stats for the dashboard dashboard
router.route('/stats')
  .get(appointmentController.getStats);

module.exports = router;
