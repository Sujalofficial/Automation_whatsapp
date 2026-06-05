# NotifiFlow - MERN Appointment Reminder System

NotifiFlow is a production-ready, call-center-oriented appointment reminder system built on the MERN stack (MongoDB, Express, React, Node.js). It integrates with Twilio (SMS/WhatsApp) to send immediate booking confirmations and schedules automated reminders for upcoming appointments using `node-cron`.

## Core Features

1. **Dashboard UI**: A premium SaaS-style interface displaying key metrics (Total Bookings, Upcoming Sessions, Reminders Sent, Twilio Simulator badge). Includes dynamic loading skeletons and toast notifications.
2. **Appointment Booking Panel**: Quick appointment creation form with realtime client-side and server-side validations (empty checks, phone formatting, future-date checks).
3. **Automated Reminders**: Background cron worker that executes every minute to identify appointments happening in the next 60 minutes, automatically dispatching reminders.
4. **Twilio Integration & Simulation Fallback**: Gracefully operates in simulation mode if Twilio environment variables are missing, outputting messages to the server console log.

---

## Project Directory Structure

```text
Automation_whatsapp/
├── server/
│   ├── config/
│   │   └── db.js                 # Mongoose connection
│   ├── controllers/
│   │   └── appointmentController.js # API endpoints logic
│   ├── models/
│   │   └── Appointment.js        # Mongoose database schema
│   ├── routes/
│   │   └── appointmentRoutes.js   # API endpoint routes mapping
│   ├── services/
│   │   └── messagingService.js    # Twilio dispatch / simulator fallback
│   ├── cron/
│   │   └── reminderCron.js        # node-cron 1-minute poller
│   ├── app.js                    # Express app middleware setup
│   ├── server.js                 # Node entrypoint
│   ├── .env                      # Local server configuration
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppointmentForm.jsx  # Booking form
│   │   │   ├── AppointmentTable.jsx # Appointments list
│   │   │   ├── DashboardStats.jsx   # Metrics grid
│   │   │   └── Loader.jsx           # Skeletons / spinner UI
│   │   ├── pages/
│   │   │   └── Dashboard.jsx        # Main dashboard screen
│   │   ├── services/
│   │   │   └── api.js               # Axios config & queries
│   │   ├── App.jsx                  # Main wrapper
│   │   └── main.jsx                 # Vite root render
│   ├── index.html
│   ├── tailwind.config.js           # Tailwind setup
│   ├── postcss.config.js            # PostCSS plugins config
│   └── package.json
└── README.md
```

---

## Environment Variables

### Backend Configuration (`server/.env`)
Create a file named `.env` in the `server/` directory:

```env
# Server Port
PORT=5000

# MongoDB URI (Atlas or Local)
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/notififlow?retryWrites=true&w=majority

# Twilio Credentials (Leave blank to run in SIMULATION MODE)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

---

## Getting Started (Setup Instructions)

### Prerequisites
* Node.js (v16+)
* MongoDB (Local Instance or Atlas Cluster)

### 1. Run the Backend Server
Navigate to the `server/` directory, install packages, and start the development server:

```bash
cd server
npm install
npm run dev
```

The console should log:
* `[Messaging] Missing Twilio credentials. Initializing in SIMULATION MODE.` (if Twilio is not configured)
* `[Database] MongoDB Connected: ...`
* `[Cron] Reminder scheduler started.`
* `[Server] Server is running in production-ready mode on port 5000`

### 2. Run the Frontend Client
Open a new terminal window, navigate to the `client/` directory, install packages, and start the development server:

```bash
cd client
npm install
npm run dev
```

Vite will start the client dev server, typically hosted at `http://localhost:5173`. Open your browser and navigate there to explore.

---

## Twilio Setup Guide

To switch from **Simulation Mode** to sending **Live SMS/WhatsApp Messages**:

1. Sign up for a free or paid account at [Twilio](https://www.twilio.com).
2. Go to the Twilio Console and retrieve your **Account SID** and **Auth Token**.
3. **SMS Setup**: Purchase a Twilio phone number or use a sandbox number, and set it as `TWILIO_PHONE_NUMBER` in your `server/.env`.
4. **WhatsApp Setup**: 
   * Navigate to the Twilio Send a WhatsApp Message Quickstart.
   * Connect your sandbox to your testing device.
   * Set `TWILIO_PHONE_NUMBER=whatsapp:+14155238886` (or your Twilio sandbox/approved sender WhatsApp number) in your `server/.env`.
   * When using WhatsApp, the recipient's phone number should also be in the format `whatsapp:+[country_code][number]`. The code automatically formats it for you.
5. Restart your backend server. It will now print: `[Messaging] Twilio client initialized successfully.`.

---

## Deployment Guide

### Backend Deployment (e.g., Render, Heroku)
1. Set up a MongoDB Atlas cloud database.
2. Link your GitHub repository containing the application.
3. Deploy the `server/` directory as a Web Service.
4. Set the environment variables in the host dashboard:
   * `MONGO_URI`
   * `PORT=80`
   * `TWILIO_ACCOUNT_SID`
   * `TWILIO_AUTH_TOKEN`
   * `TWILIO_PHONE_NUMBER`
5. Since `node-cron` is built into the node process, it will execute automatically in the background as long as the instance is active. (Avoid using free tier providers that sleep, or use a ping service to keep the process running).

### Frontend Deployment (e.g., Vercel, Netlify)
1. Build the production build locally or using the cloud pipeline:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the generated `client/dist` directory to your static hosting provider.
3. Set the environment variable `VITE_API_URL` to point to your live backend endpoint (e.g., `https://api.yourdomain.com/api`).
