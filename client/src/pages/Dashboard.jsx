import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, CheckCircle, AlertTriangle, CalendarRange } from 'lucide-react';
import DashboardStats from '../components/DashboardStats';
import AppointmentForm from '../components/AppointmentForm';
import AppointmentTable from '../components/AppointmentTable';
import { getAppointments, getStats } from '../services/api';
import { StatsSkeleton } from '../components/Loader';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // Toast notifications state
  const [toast, setToast] = useState(null);

  // Trigger toast alert helper
  const triggerToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  // Primary data load function
  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const [apptData, statsData] = await Promise.all([
        getAppointments(),
        getStats()
      ]);

      if (apptData.success) {
        setAppointments(apptData.data);
      }
      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (err) {
      console.error('[Dashboard Error] Failed to load data:', err);
      setError(
        err.response?.data?.message || 
        'Could not connect to the API. Make sure the backend server is running.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    loadData();

    // Set up auto-polling interval to keep dashboard refreshed (every 20 seconds)
    // Useful for seeing the results of the 1-minute reminder cron scheduler in real-time
    const interval = setInterval(() => {
      loadData(true);
    }, 20000);

    return () => clearInterval(interval);
  }, [loadData]);

  const handleBookingSuccess = (successMsg) => {
    triggerToast(successMsg, 'success');
    loadData(true);
  };

  const handleBookingError = (errorMsg) => {
    triggerToast(errorMsg, 'error');
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] text-white">
      {/* Toast Alert Toast Container */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in">
          <div
            className={`flex items-center space-x-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl ${
              toast.type === 'error'
                ? 'bg-rose-950/80 border-rose-500/50 text-rose-200'
                : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <span className="text-sm font-semibold pr-2">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <nav className="border-b border-white/10 bg-slate-950/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
              <CalendarRange className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                NotifiFlow
              </span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-md">
                v1.0
              </span>
            </div>
          </div>

          <button
            onClick={() => loadData(true)}
            disabled={loading || refreshing}
            className="flex items-center space-x-2 bg-white/5 border border-white/15 hover:bg-white/10 active:scale-95 transition-all duration-150 text-sm font-semibold px-4 py-2.5 rounded-2xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 text-gray-300 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </nav>

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && !stats ? (
          <div className="space-y-6">
            <StatsSkeleton />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 h-96 bg-white/5 rounded-3xl animate-pulse"></div>
              <div className="lg:col-span-2 h-96 bg-white/5 rounded-3xl animate-pulse"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Dashboard Aggregations */}
            <DashboardStats stats={stats} />

            {/* Creation and List section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Sidebar Booking Form */}
              <div className="lg:col-span-1">
                <AppointmentForm onSuccess={handleBookingSuccess} onError={handleBookingError} />
              </div>

              {/* Data registry table */}
              <div className="lg:col-span-2 h-full">
                <AppointmentTable appointments={appointments} isLoading={loading} error={error} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
