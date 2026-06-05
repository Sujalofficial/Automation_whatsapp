# Assignment Submission Report - AI Automation Developer Practical Test
**Company**: Better Call Centers / El Paso Water Quality LLC  
**Candidate**: Sujal Agrawal  
**Repository**: [Automation_whatsapp](https://github.com/Sujalofficial/Automation_whatsapp)

---

## 1. Project Overview & Features
This project is a complete **WhatsApp/SMS Appointment Reminder System** built on the MERN stack. It includes:
* **Interactive Dashboard**: A modern, responsive React interface showcasing real-time metrics (Total Bookings, Upcoming Sessions, Reminders Sent).
* **Real-time Form Validation**: Client-side and server-side validation for phone formats and future dates.
* **Immediate Messaging Confirmation**: Automatically dispatches a WhatsApp/SMS confirmation upon booking.
* **Dual-Mode Messaging Service**: Features live Twilio integration, falling back gracefully to **Simulation Mode** (console logging) if credentials are omitted.
* **Automated background cron worker (`node-cron`)**: Polls the database every minute to fetch appointments scheduled within the next 60 minutes and dispatches automated reminder notifications.

---

## 2. Technical Stack Used
* **Frontend**: React (Vite), Tailwind CSS, Axios, Lucide Icons
* **Backend**: Node.js, Express, `node-cron`, Twilio SDK, `dotenv`, `cross-env`
* **Database**: MongoDB Atlas (Cloud) & Mongoose (Object Modeling)
* **Hosting**: 
  * Backend API: Deployed on **Render**
  * Frontend App: Deployed on **Vercel**

---

## 3. Written Explanation (Data Flow & Architecture)
The application follows a traditional MERN monolithic data flow architecture. 

1. **Booking Flow**: When a user submits an appointment form on the React client, Axios issues a `POST` request to `/api/appointments`. The Express server validates the data, creates a Mongoose document, and saves it to MongoDB Atlas. 
2. **Instant Dispatch**: Upon successful database insertion, the server invokes the `messagingService` to send an immediate confirmation message to the client's phone number using Twilio's WhatsApp/SMS client.
3. **Live Syncing**: The dashboard constantly pulls real-time updates and stats from the MongoDB database via the `/api/appointments` and `/api/appointments/stats` endpoints.
4. **Background Cron Worker**: A `node-cron` daemon runs continuously on the server. Every minute, it queries MongoDB for appointments scheduled within the next 60 minutes that have not yet had a reminder dispatched. It sends the Twilio reminder, marks `reminderSent: true` on the document, and updates the database.

---

## 4. Hardest Part Solved
The most challenging aspect was configuring the automated **background cron scheduler** to run reliably in a cloud environment alongside the server. In serverless/stateless environments, background timers are often killed or suspended. To solve this:
1. Deployed the backend as a persistent Node web service on **Render**, ensuring the continuous execution of the `node-cron` worker.
2. Built query logic to prevent double-reminders by verifying the `reminderSent` state flag.
3. Configured absolute path resolution for environment variables in the monorepo root to guarantee seamless database connection startup regardless of execution paths.

---

## 5. Development Time
* **Total Time**: Approximately **6 to 8 hours** of active development (including backend architecture design, database setup, frontend rendering, cron worker debugging, and live deployment configuration).
