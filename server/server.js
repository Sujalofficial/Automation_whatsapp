// Load environment variables before running other logic
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = require('./app');
const connectDB = require('./config/db');
const initReminderCron = require('./cron/reminderCron');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to MongoDB Database
    console.log('[Server] Connecting to database...');
    await connectDB();

    // 2. Initialize the automated reminder Cron job
    console.log('[Server] Initializing cron scheduler...');
    initReminderCron();

    // 3. Start Express server listener
    app.listen(PORT, () => {
      console.log(`[Server] Server is running in production-ready mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`[Server Critical Fail] Startup sequence failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
