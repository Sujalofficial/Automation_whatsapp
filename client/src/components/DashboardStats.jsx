import React from 'react';
import { Calendar, Users, MessageSquare, ShieldAlert, Radio } from 'lucide-react';

const DashboardStats = ({ stats }) => {
  const { totalAppointments = 0, upcomingAppointments = 0, remindersSentCount = 0, isSimulatedMode = true } = stats || {};

  const cards = [
    {
      title: 'Total Bookings',
      value: totalAppointments,
      description: 'Lifetime recorded appointments',
      icon: Users,
      color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
    },
    {
      title: 'Upcoming Sessions',
      value: upcomingAppointments,
      description: 'Scheduled for future hours',
      icon: Calendar,
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
    },
    {
      title: 'Reminders Sent',
      value: remindersSentCount,
      description: 'Dispatched automated alerts',
      icon: MessageSquare,
      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
    },
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Simulation Banner */}
      {isSimulatedMode && (
        <div className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl backdrop-blur-md text-amber-300 animate-pulse">
          <div className="flex items-center space-x-3">
            <ShieldAlert className="w-6 h-6 shrink-0 text-amber-400" />
            <div>
              <p className="font-semibold text-sm">Twilio Simulation Mode Active</p>
              <p className="text-xs text-amber-400/80">
                Twilio credentials are not set. Messages will be outputted to the server console log, and records will be marked as "Simulated".
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1 bg-amber-500/20 rounded-full text-xs font-semibold uppercase tracking-wider border border-amber-500/20">
            <Radio className="w-3.5 h-3.5 animate-ping" />
            <span>Simulated</span>
          </div>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`bg-gradient-to-br ${card.color} backdrop-blur-lg border rounded-3xl p-6 shadow-xl hover:-translate-y-1 transition-all duration-300 group`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium tracking-wide text-gray-300 uppercase">{card.title}</span>
                <div className="p-3 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-4xl font-extrabold text-white tracking-tight mb-2">
                {card.value}
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardStats;
