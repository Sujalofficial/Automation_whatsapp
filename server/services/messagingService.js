const twilio = require('twilio');

// Retrieve Twilio settings from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

// Helper to determine if we are running in Simulation Mode
const isSimulationMode = () => {
  return !accountSid || !authToken || !fromNumber;
};

// Initialize Twilio client only if credentials exist
let twilioClient = null;
if (!isSimulationMode()) {
  try {
    twilioClient = twilio(accountSid, authToken);
    console.log('[Messaging] Twilio client initialized successfully.');
  } catch (error) {
    console.error(`[Messaging Warning] Failed to initialize Twilio: ${error.message}. Running in Simulation mode.`);
  }
} else {
  console.log('[Messaging] Missing Twilio credentials. Initializing in SIMULATION MODE.');
}

/**
 * Format date for friendly message display.
 */
const formatFriendlyDate = (date) => {
  return new Date(date).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Helper to construct the message body.
 */
const getConfirmationText = (name, date) => {
  return `Hello ${name}, your appointment has been confirmed for ${formatFriendlyDate(date)}. Thank you!`;
};

const getReminderText = (name, date) => {
  return `Reminder: Hello ${name}, you have an upcoming appointment scheduled for ${formatFriendlyDate(date)}. We look forward to seeing you.`;
};

/**
 * Sends a message via Twilio (WhatsApp/SMS) or simulates it.
 * @param {string} to - Destination phone number.
 * @param {string} body - The text body to send.
 * @returns {Promise<{success: boolean, mode: 'twilio'|'simulated', sid?: string}>}
 */
const sendMessage = async (to, body) => {
  if (isSimulationMode() || !twilioClient) {
    console.log('\n--- SIMULATED MESSAGE SENT ---');
    console.log(`To: ${to}`);
    console.log(`Body: ${body}`);
    console.log('------------------------------\n');
    return { success: true, mode: 'simulated' };
  }

  try {
    // If fromNumber starts with 'whatsapp:', we must ensure the 'to' number also has 'whatsapp:' prefix
    let senderNumber = fromNumber;
    let recipientNumber = to;

    if (senderNumber.startsWith('whatsapp:')) {
      if (!recipientNumber.startsWith('whatsapp:')) {
        recipientNumber = `whatsapp:${recipientNumber}`;
      }
    }

    const message = await twilioClient.messages.create({
      body: body,
      from: senderNumber,
      to: recipientNumber,
    });

    console.log(`[Messaging] Twilio Message sent. SID: ${message.sid}`);
    return { success: true, mode: 'twilio', sid: message.sid };
  } catch (error) {
    console.error(`[Messaging Error] Twilio dispatch failed: ${error.message}. Falling back to simulation log.`);
    console.log('\n--- FAILED DISPATCH SIMULATION ---');
    console.log(`To: ${to}`);
    console.log(`Body: ${body}`);
    console.log('----------------------------------\n');
    return { success: true, mode: 'simulated' };
  }
};

/**
 * Send booking confirmation.
 */
const sendConfirmationMessage = async (customerName, phoneNumber, appointmentTime) => {
  const body = getConfirmationText(customerName, appointmentTime);
  return await sendMessage(phoneNumber, body);
};

/**
 * Send automated reminder.
 */
const sendReminderMessage = async (customerName, phoneNumber, appointmentTime) => {
  const body = getReminderText(customerName, appointmentTime);
  return await sendMessage(phoneNumber, body);
};

module.exports = {
  sendConfirmationMessage,
  sendReminderMessage,
  isSimulationMode,
};
