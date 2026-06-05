import React, { useState } from 'react';
import { User, Phone, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { createAppointment } from '../services/api';

const AppointmentForm = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    appointmentTime: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate the phone number format on frontend
  const validatePhone = (num) => {
    const regex = /^\+?[0-9\s\-()]{7,20}$/;
    return regex.test(num);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field-specific error as user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    // Validate inputs
    if (!formData.customerName.trim()) {
      errors.customerName = 'Customer name is required';
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!validatePhone(formData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number (e.g. +1234567890)';
    }

    if (!formData.appointmentTime) {
      errors.appointmentTime = 'Appointment date & time is required';
    } else {
      const selectedDate = new Date(formData.appointmentTime);
      if (selectedDate <= new Date()) {
        errors.appointmentTime = 'Appointment must be set in the future';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createAppointment({
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        appointmentTime: formData.appointmentTime,
      });

      if (result.success) {
        onSuccess(result.message);
        // Reset form
        setFormData({
          customerName: '',
          phoneNumber: '',
          appointmentTime: '',
        });
      } else {
        onError(result.message || 'Failed to schedule appointment.');
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message || 'Server error. Please check backend log and try again.';
      onError(serverMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
      <div className="flex items-center space-x-2 mb-6">
        <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
          <Calendar className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-white">Book Appointment</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Customer Name */}
        <div>
          <label htmlFor="customerName" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Customer Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
              <User className="w-4 h-4" />
            </span>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              placeholder="John Doe"
              className={`w-full bg-white/5 border rounded-2xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                formErrors.customerName
                  ? 'border-rose-500/50 focus:ring-rose-500/30'
                  : 'border-white/15 focus:border-indigo-500 focus:ring-indigo-500/30'
              }`}
            />
          </div>
          {formErrors.customerName && (
            <p className="flex items-center text-xs text-rose-400 mt-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5 mr-1" />
              {formErrors.customerName}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Phone Number (SMS/WhatsApp)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
              <Phone className="w-4 h-4" />
            </span>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="+1234567890"
              className={`w-full bg-white/5 border rounded-2xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                formErrors.phoneNumber
                  ? 'border-rose-500/50 focus:ring-rose-500/30'
                  : 'border-white/15 focus:border-indigo-500 focus:ring-indigo-500/30'
              }`}
            />
          </div>
          {formErrors.phoneNumber && (
            <p className="flex items-center text-xs text-rose-400 mt-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5 mr-1" />
              {formErrors.phoneNumber}
            </p>
          )}
        </div>

        {/* Appointment Time */}
        <div>
          <label htmlFor="appointmentTime" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Appointment Date & Time
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
              <Calendar className="w-4 h-4" />
            </span>
            <input
              type="datetime-local"
              id="appointmentTime"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleInputChange}
              className={`w-full bg-white/5 border rounded-2xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all [color-scheme:dark] ${
                formErrors.appointmentTime
                  ? 'border-rose-500/50 focus:ring-rose-500/30'
                  : 'border-white/15 focus:border-indigo-500 focus:ring-indigo-500/30'
              }`}
            />
          </div>
          {formErrors.appointmentTime && (
            <p className="flex items-center text-xs text-rose-400 mt-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5 mr-1" />
              {formErrors.appointmentTime}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full relative overflow-hidden group bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-2xl py-3.5 transition-all shadow-lg hover:shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Confirm & Book</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
