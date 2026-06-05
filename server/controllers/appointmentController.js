const Appointment = require('../models/Appointment');
const messagingService = require('../services/messagingService');

/**
 * Regex for basic phone validation (allows leading +, digits, spaces, hyphens, parentheses; 7-20 chars).
 */
const PHONE_REGEX = /^\+?[0-9\s\-()]{7,20}$/;

/**
 * Create a new appointment.
 * POST /api/appointments
 */
exports.createAppointment = async (req, res) => {
  try {
    const { customerName, phoneNumber, appointmentTime } = req.body;

    // 1. Validation: Check if fields exist
    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ success: false, message: 'Customer name is required' });
    }
    if (!phoneNumber || !phoneNumber.trim()) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }
    if (!appointmentTime) {
      return res.status(400).json({ success: false, message: 'Appointment date & time is required' });
    }

    // 2. Validation: Phone format
    if (!PHONE_REGEX.test(phoneNumber.trim())) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid phone number format. Please enter a valid number (e.g. +1234567890).' 
      });
    }

    // 3. Validation: Date must be in the future
    const appointmentDate = new Date(appointmentTime);
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid appointment date format' });
    }

    if (appointmentDate <= new Date()) {
      return res.status(400).json({ success: false, message: 'Appointment time must be in the future' });
    }

    // 4. Create and save the appointment
    const appointment = new Appointment({
      customerName: customerName.trim(),
      phoneNumber: phoneNumber.trim(),
      appointmentTime: appointmentDate,
      status: 'Pending',
    });

    // 5. Send confirmation message
    const msgResult = await messagingService.sendConfirmationMessage(
      appointment.customerName,
      appointment.phoneNumber,
      appointment.appointmentTime
    );

    // Update status based on Twilio service response
    appointment.confirmationSent = true;
    if (msgResult.mode === 'simulated') {
      appointment.status = 'Simulated';
    } else {
      appointment.status = 'Confirmed';
    }

    await appointment.save();

    return res.status(201).json({
      success: true,
      message: `Appointment created successfully. Confirmation message ${
        msgResult.mode === 'simulated' ? 'simulated' : 'sent'
      }.`,
      data: appointment,
    });
  } catch (error) {
    console.error(`[Controller Error] Failed to create appointment: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating appointment. Please try again.',
    });
  }
};

/**
 * Retrieve all appointments.
 * GET /api/appointments
 */
exports.getAppointments = async (req, res) => {
  try {
    // Sort appointments: latest scheduled first, or sort by creation timestamp
    const appointments = await Appointment.find({}).sort({ appointmentTime: 1 });
    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error(`[Controller Error] Failed to fetch appointments: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching appointments.',
    });
  }
};

/**
 * Get dashboard statistics.
 * GET /api/appointments/stats
 */
exports.getStats = async (req, res) => {
  try {
    const now = new Date();

    // Query various stats concurrently
    const [totalAppointments, upcomingAppointments, remindersSentCount, recentActivity] = await Promise.all([
      Appointment.countDocuments({}),
      Appointment.countDocuments({ appointmentTime: { $gt: now }, status: { $ne: 'Cancelled' } }),
      Appointment.countDocuments({ reminderSent: true }),
      Appointment.find({}).sort({ createdAt: -1 }).limit(5), // 5 most recent actions
    ]);

    // Return current simulator mode config status
    const isSimulated = messagingService.isSimulationMode();

    return res.status(200).json({
      success: true,
      data: {
        totalAppointments,
        upcomingAppointments,
        remindersSentCount,
        recentActivity,
        isSimulatedMode: isSimulated,
      },
    });
  } catch (error) {
    console.error(`[Controller Error] Failed to fetch stats: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error while compiling dashboard statistics.',
    });
  }
};
