const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const messagingService = require('../services/messagingService');

/**
 * Initializes the automated reminder cron job.
 * Runs every minute to dispatch upcoming appointment alerts.
 */
const initReminderCron = () => {
  // Cron syntax: * * * * * (runs every minute)
  cron.schedule('* * * * *', async () => {
    console.log('[Cron] Checking for upcoming appointments requiring reminders...');
    
    try {
      const now = new Date();
      const sixtyMinutesFromNow = new Date(now.getTime() + 60 * 60 * 1000);

      // Find appointments scheduled within the next 60 minutes that haven't received a reminder
      // Exclude Cancelled appointments
      const upcomingAppointments = await Appointment.find({
        appointmentTime: {
          $gte: now,
          $lte: sixtyMinutesFromNow
        },
        reminderSent: false,
        status: { $ne: 'Cancelled' }
      });

      if (upcomingAppointments.length === 0) {
        console.log('[Cron] No reminders to send at this time.');
        return;
      }

      console.log(`[Cron] Found ${upcomingAppointments.length} upcoming appointment(s). Sending reminders...`);

      for (const appt of upcomingAppointments) {
        try {
          // Send reminder message
          const result = await messagingService.sendReminderMessage(
            appt.customerName,
            appt.phoneNumber,
            appt.appointmentTime
          );

          // Update appointment flags
          appt.reminderSent = true;
          
          // Update status based on Twilio mode
          if (result.mode === 'simulated') {
            appt.status = 'Simulated';
          } else {
            appt.status = 'Reminder Sent';
          }

          await appt.save();
          console.log(`[Cron] Reminder successfully sent and updated for customer: ${appt.customerName}`);
        } catch (apptErr) {
          console.error(`[Cron Error] Failed to process reminder for appointment ${appt._id}: ${apptErr.message}`);
        }
      }
    } catch (error) {
      console.error(`[Cron Critical Error] Reminder check failed: ${error.message}`);
    }
  });
  
  console.log('[Cron] Reminder scheduler started.');
};

module.exports = initReminderCron;
