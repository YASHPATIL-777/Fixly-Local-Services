import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  ClipboardList, 
  CheckCircle2, 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Edit3, 
  X,
  PlayCircle,
  CheckCheck,
  Loader2,
  MessageSquare
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import DashboardCard from '../components/cards/DashboardCard';
import PageTransition from '../components/layout/PageTransition';
import NotificationBell from '../components/common/NotificationBell';
import { useAuth } from '../context/AuthContext';
import { getMyTechnicianProfile, updateMyTechnicianProfile } from '../services/technicianService';
import { getTechnicianRequests, startServiceRequest, completeServiceRequest, acceptServiceRequest } from '../services/requestService';
import { getAllServices } from '../services/serviceService';

import ErrorState from '../components/common/ErrorState';

export default function TechnicianDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();

  const [techProfile, setTechProfile] = useState(null);
  const [requestsList, setRequestsList] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Edit Profile Form state
  const [bioInput, setBioInput] = useState('');
  const [experienceInput, setExperienceInput] = useState(5);
  const [locationInput, setLocationInput] = useState('Thane');
  const [serviceAreaInput, setServiceAreaInput] = useState('Thane, Mulund, Bhandup');
  const [hourlyRateInput, setHourlyRateInput] = useState('₹800 – ₹1,200');
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const [profileRes, reqsRes, servicesRes] = await Promise.all([
        getMyTechnicianProfile(),
        getTechnicianRequests('ALL'),
        getAllServices()
      ]);

      const prof = profileRes.data;
      setTechProfile(prof);
      setRequestsList(reqsRes.data || []);
      setAllServices(servicesRes.data || []);

      if (prof) {
        setBioInput(prof.bio || '');
        setExperienceInput(prof.experienceYears || 5);
        setLocationInput(prof.location || 'Thane');
        setServiceAreaInput(prof.serviceArea || 'Thane');
        setHourlyRateInput(prof.hourlyRate || '₹800 – ₹1,200');
        setSelectedServiceIds((prof.serviceIds || []).map(s => s._id || s));
      }
    } catch (err) {
      console.error('Technician dashboard data error:', err.message);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleAvailability = async () => {
    if (!techProfile || updatingAvailability) return;
    setUpdatingAvailability(true);
    try {
      const updatedAvailability = !techProfile.availability;
      const res = await updateMyTechnicianProfile({ availability: updatedAvailability });
      setTechProfile(res.data);
      setNotification(`Status updated: ${updatedAvailability ? 'Available for work' : 'Currently unavailable'}`);
    } catch (err) {
      setNotification(`Failed to toggle availability: ${err.message}`);
    } finally {
      setUpdatingAvailability(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleStartJob = async (id) => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await startServiceRequest(id);
      setNotification('Service started! Work is now in progress.');
      await fetchDashboardData();
    } catch (err) {
      setNotification(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleCompleteJob = async (id) => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await completeServiceRequest(id);
      setNotification('Service completed successfully!');
      await fetchDashboardData();
    } catch (err) {
      setNotification(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleAcceptJob = async (id) => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await acceptServiceRequest(id);
      setNotification('Service request accepted!');
      await fetchDashboardData();
    } catch (err) {
      setNotification(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        bio: bioInput,
        experienceYears: Number(experienceInput),
        location: locationInput,
        serviceArea: serviceAreaInput,
        hourlyRate: hourlyRateInput,
        serviceIds: selectedServiceIds
      };
      const res = await updateMyTechnicianProfile(payload);
      setTechProfile(res.data);
      setEditingProfile(false);
      setNotification('Professional profile updated successfully');
    } catch (err) {
      setNotification(`Update error: ${err.message}`);
    } finally {
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Stats Calculations
  const newRequestsCount = requestsList.filter(r => r.status === 'PENDING').length;
  const acceptedJobsCount = requestsList.filter(r => r.status === 'ACCEPTED').length;
  const activeJobsCount = requestsList.filter(r => r.status === 'IN_PROGRESS').length;
  const completedJobsCount = requestsList.filter(r => r.status === 'COMPLETED').length;

  const displayName = user?.name || 'Rahul Kumar';
  const displayInitials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const isAvailable = techProfile ? techProfile.availability : true;
  const vStatus = techProfile ? techProfile.verificationStatus : 'approved';

  const activeJobsList = requestsList.filter(r => r.status === 'IN_PROGRESS' || r.status === 'ACCEPTED');
  const pendingRequestsList = requestsList.filter(r => r.status === 'PENDING');

  return (
    <PageTransition>
      <div className="min-h-screen flex bg-slate-50">
        {/* Sidebar */}
        <Sidebar role="technician" activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Header */}
          <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-xs">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">Professional Dashboard</h1>
              <p className="text-xs text-slate-500">Welcome back, {displayName}</p>
            </div>

            <div className="flex items-center space-x-3">
              {/* Availability Toggle Switch */}
              <button
                onClick={handleToggleAvailability}
                disabled={updatingAvailability}
                className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                  isAvailable
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                    : 'bg-slate-200 text-slate-700 border border-slate-300 hover:bg-slate-300'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full mr-2 ${isAvailable ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`}></span>
                {isAvailable ? '🟢 Available for Work' : '⚪ Currently Unavailable'}
              </button>

              {/* Notification Bell */}
              <NotificationBell />

              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                {displayInitials}
              </div>
            </div>
          </header>

          {/* Action Notification */}
          <AnimatePresence>
            {notification && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-slate-900 text-white px-6 py-3 border-b border-slate-800 flex items-center justify-between text-xs font-bold"
              >
                <span>{notification}</span>
                <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dashboard Workspace */}
          <main className="p-6 max-w-7xl w-full space-y-8">
            {hasError ? (
              <ErrorState 
                title="Something went wrong"
                message="We couldn't load your professional dashboard data from the server."
                onRetry={fetchDashboardData}
              />
            ) : (
              <>
            {/* Today's Metric Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <DashboardCard title="New Requests" value={newRequestsCount} icon={ClipboardList} color="blue" />
              <DashboardCard title="Accepted Jobs" value={acceptedJobsCount} icon={Clock} color="amber" />
              <DashboardCard title="Active Jobs" value={activeJobsCount} icon={Wrench} color="purple" />
              <DashboardCard title="Completed Jobs" value={completedJobsCount} icon={CheckCircle2} color="emerald" />
            </div>

            {/* Active & Accepted Jobs Section (Phase 5 Lifecycle) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center">
                    <Wrench className="w-5 h-5 text-blue-600 mr-2" />
                    Active Jobs & Confirmed Bookings ({activeJobsList.length})
                  </h2>
                  <p className="text-xs text-slate-500">Manage live work progress and transition statuses</p>
                </div>
                <Link to="/technician/requests" className="text-xs font-bold text-blue-600 hover:underline">
                  View All Requests →
                </Link>
              </div>

              {activeJobsList.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-400 space-y-1">
                  <p className="font-bold text-slate-700">No active jobs currently in progress.</p>
                  <p>Accepted customer requests will appear here for you to start work.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {activeJobsList.map((job) => {
                    const custName = job.customerId?.name || 'Customer';
                    const sName = job.serviceId?.name || 'Service';
                    const bookingRef = job.bookingReference || `FX-2026-${job._id.substring(0, 6).toUpperCase()}`;

                    return (
                      <div key={job._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                {bookingRef}
                              </span>
                              <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-slate-100 text-slate-700">
                                {sName}
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-slate-900">Customer: {custName}</h3>
                          </div>

                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                              job.status === 'IN_PROGRESS'
                                ? 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                              {job.status === 'IN_PROGRESS' ? '🔵 Service In Progress' : '🟢 Confirmed / Accepted'}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-900">{job.problemTitle}</h4>
                          <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            "{job.problemDescription}"
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-slate-100 gap-3 text-xs">
                          <span className="text-slate-500 font-medium">Location: <strong>{job.address}, {job.city}</strong></span>

                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/technician/requests/${job._id}/chat`}
                              className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center space-x-1.5"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Message Customer</span>
                            </Link>

                            {job.status === 'ACCEPTED' && (
                              <button
                                disabled={actionLoading}
                                onClick={() => handleStartJob(job._id)}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
                              >
                                <PlayCircle className="w-4 h-4" />
                                <span>Start Service</span>
                              </button>
                            )}

                            {job.status === 'IN_PROGRESS' && (
                              <button
                                disabled={actionLoading}
                                onClick={() => handleCompleteJob(job._id)}
                                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
                              >
                                <CheckCheck className="w-4 h-4" />
                                <span>Complete Job</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* New Incoming Requests Section */}
            {pendingRequestsList.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center">
                  <ClipboardList className="w-5 h-5 text-amber-600 mr-2" />
                  New Incoming Service Requests ({pendingRequestsList.length})
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  {pendingRequestsList.map((req) => (
                    <div key={req._id} className="bg-white rounded-2xl border p-6 border-slate-200 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{req.problemTitle}</h3>
                          <p className="text-slate-500">Customer: {req.customerId?.name || 'Customer'}</p>
                        </div>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleAcceptJob(req._id)}
                          className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-700"
                        >
                          Accept Request
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            </>
          )}

          </main>
        </div>
      </div>
    </PageTransition>
  );
}
