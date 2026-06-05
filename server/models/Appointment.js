const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    appointmentTime: {
      type: Date,
      required: [true, 'Appointment date & time is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Reminder Sent', 'Simulated', 'Cancelled'],
      default: 'Pending',
    },
    confirmationSent: {
      type: Boolean,
      default: false,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    // Automatically manage createdAt and updatedAt timestamps
    timestamps: true,
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
