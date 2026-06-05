import axios from 'axios';

// Configure Axios with default base URL pointing to Node backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch all appointments from database.
 */
export const getAppointments = async () => {
  const response = await api.get('/appointments');
  return response.data;
};

/**
 * Book a new appointment.
 * @param {Object} appointmentData - { customerName, phoneNumber, appointmentTime }
 */
export const createAppointment = async (appointmentData) => {
  const response = await api.post('/appointments', appointmentData);
  return response.data;
};

/**
 * Fetch statistics for the dashboard.
 */
export const getStats = async () => {
  const response = await api.get('/appointments/stats');
  return response.data;
};

export default api;
