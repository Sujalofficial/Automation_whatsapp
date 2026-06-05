import React, { useState } from 'react';
import { Search, Filter, AlertCircle, Info, Calendar, Phone, User, Clock } from 'lucide-react';
import { TableSkeleton } from './Loader';

const AppointmentTable = ({ appointments, isLoading, error }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Format Helper: Long readable date/time for scheduled event
  const formatEventTime = (timeStr) => {
    const d = new Date(timeStr);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format Helper: Short/Relative style for booking date
  const formatCreatedTime = (timeStr) => {
    const d = new Date(timeStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Return specific tailwind styling for statuses
  const getStatusBadge = (status) => {
    const styles = {
      Pending: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
      Confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      'Reminder Sent': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      Simulated: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      Cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    };

    const currentStyle = styles[status] || styles['Pending'];
    return (
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${currentStyle}`}>
        {status}
      </span>
    );
  };

  // Filter & Search Logics
  const filteredAppointments = appointments.filter((appt) => {
    const matchesSearch =
      appt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.phoneNumber.includes(searchTerm);
    const matchesFilter = statusFilter === 'All' || appt.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-full">
      {/* Search and Filters Header */}
      <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Bookings Registry</h2>
          <p className="text-xs text-gray-400">Manage and track notification queues</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/15 focus:border-indigo-500 rounded-2xl py-2 pl-9 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-60 transition-all"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative flex items-center">
            <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/5 border border-white/15 focus:border-indigo-500 rounded-2xl py-2 pl-9 pr-8 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none [color-scheme:dark] transition-all cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Reminder Sent">Reminder Sent</option>
              <option value="Simulated">Simulated</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Display */}
      <div className="overflow-x-auto grow">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton />
          </div>
        ) : error ? (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-12 h-12 text-rose-400 mb-4 animate-bounce" />
            <h3 className="text-lg font-semibold text-white mb-1">Failed to retrieve records</h3>
            <p className="text-sm text-gray-400 max-w-md">{error}</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <Info className="w-12 h-12 text-indigo-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-1">No appointments found</h3>
            <p className="text-sm text-gray-400 max-w-sm">
              {searchTerm || statusFilter !== 'All'
                ? 'Try adjusting your search criteria or filter options.'
                : 'Get started by creating a new appointment using the booking panel.'}
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-gray-300 text-xs font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Contact Number</th>
                <th className="py-4 px-6">Appointment Time</th>
                <th className="py-4 px-6">Notification Status</th>
                <th className="py-4 px-6">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-gray-200">
              {filteredAppointments.map((appt) => (
                <tr
                  key={appt._id}
                  className="hover:bg-white/5 transition-colors duration-150 group"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-300 flex items-center justify-center font-bold text-xs uppercase border border-indigo-500/20 group-hover:scale-110 transition-transform">
                        {appt.customerName.charAt(0)}
                      </div>
                      <span className="font-semibold text-white">{appt.customerName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1.5 text-gray-300">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{appt.phoneNumber}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1.5 text-gray-300">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{formatEventTime(appt.appointmentTime)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">{getStatusBadge(appt.status)}</td>
                  <td className="py-4 px-6 text-gray-400 text-xs">
                    {formatCreatedTime(appt.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer statistics summaries */}
      {!isLoading && !error && filteredAppointments.length > 0 && (
        <div className="px-6 py-4 border-t border-white/10 bg-white/5 text-xs text-gray-400 flex items-center justify-between">
          <span>
            Showing {filteredAppointments.length} of {appointments.length} appointments
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
            <span>Real-time Sync</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default AppointmentTable;
