import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, 
  Clock, 
  MapPin, 
  Calendar, 
  XCircle, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Plus, 
  X,
  PlayCircle,
  CheckCheck,
  MessageSquare
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import PageTransition from '../components/layout/PageTransition';
import { getMyCustomerRequests, cancelServiceRequest } from '../services/requestService';

import ErrorState from '../components/common/ErrorState';

export default function CustomerRequestsPage() {
  const [activeTab, setActiveTab] = useState('requests');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const res = await getMyCustomerRequests(statusFilter);
      setRequests(res.data || []);
    } catch (err) {
      console.error('Customer requests fetch error:', err.message);
      setHasError(true);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const handleCancelRequest = async (id) => {
    setActionLoading(true);
    try {
      await cancelServiceRequest(id);
      setNotification('Service request cancelled successfully');
      await fetchRequests();
    } catch (err) {
      setNotification(`Cancellation error: ${err.message}`);
    } finally {
      setActionLoading(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex bg-slate-50">
        <Sidebar role="customer" activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Header */}
          <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-xs">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">My Service Bookings</h1>
              <p className="text-xs text-slate-500">Track upcoming, active in-progress, and completed services</p>
            </div>

            <div className="flex items-center space-x-3">
              {/* Filter Tabs */}
              <div className="hidden sm:flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                {['ALL', 'UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg transition-colors capitalize ${
                      statusFilter === st
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st === 'UPCOMING' ? 'Upcoming' : st === 'ACTIVE' ? 'Active In Progress' : st.toLowerCase()}
                  </button>
                ))}
              </div>

              <Link
                to="/services"
                className="inline-flex items-center text-xs font-semibold px-3.5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                New Service Request
              </Link>
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

          {/* Workspace */}
          <main className="p-6 max-w-7xl w-full space-y-6">
            
            {loading ? (
              <div className="py-16 text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <span>Loading your booking history...</span>
              </div>
            ) : hasError ? (
              <ErrorState 
                title="Failed to Load Service Bookings"
                message="We couldn't load your service request history from the server."
                onRetry={fetchRequests}
              />
            ) : requests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto my-8 shadow-xs">
                <ClipboardList className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">No Bookings Found</h3>
                <p className="text-xs text-slate-500">Book a trusted local professional to get started.</p>
                <Link to="/technicians" className="inline-block px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md">
                  Find a Professional
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {requests.map((req) => {
                  const techName = req.technicianId?.userId?.name || req.technicianId?.name || 'Professional';
                  const serviceName = req.serviceId?.name || 'Local Service';
                  const dateStr = new Date(req.serviceDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                  const status = req.status;
                  const bookingRef = req.bookingReference || `FX-2026-${req._id.substring(0, 6).toUpperCase()}`;

                  return (
                    <motion.div 
                      key={req._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-3">
                            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                              REF: {bookingRef}
                            </span>
                            <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-slate-100 text-slate-700">
                              {serviceName}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900">{req.problemTitle}</h3>
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-extrabold border flex items-center space-x-1.5 ${
                            status === 'ACCEPTED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : status === 'IN_PROGRESS'
                              ? 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse'
                              : status === 'COMPLETED'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : status === 'REJECTED'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : status === 'CANCELLED'
                              ? 'bg-slate-100 text-slate-600 border-slate-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            <span>
                              {status === 'ACCEPTED' ? '🟢 Confirmed Booking' : status === 'IN_PROGRESS' ? '🔵 Service In Progress' : status === 'COMPLETED' ? '🟣 Service Completed' : status === 'REJECTED' ? '🔴 Declined' : status === 'CANCELLED' ? '⚪ Cancelled' : '🟡 Pending Review'}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Problem Description */}
                      <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 font-normal">
                        "{req.problemDescription}"
                      </p>

                      {/* Request Info Bar */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 pt-1">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                          <span>{dateStr} at <strong>{req.serviceTime}</strong></span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                          <span className="truncate">{req.address}, {req.city}</span>
                        </div>
                        <div className="flex items-center space-x-2 sm:justify-end">
                          <span className="text-slate-400 font-medium">Professional:</span>
                          <strong className="text-slate-900">{techName}</strong>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/customer/requests/${req._id}`}
                            className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center"
                          >
                            View Booking Details →
                          </Link>

                          {['ACCEPTED', 'IN_PROGRESS', 'COMPLETED'].includes(status) && (
                            <Link
                              to={`/customer/requests/${req._id}/chat`}
                              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center space-x-1.5"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Message Professional</span>
                            </Link>
                          )}
                        </div>

                        {(status === 'PENDING' || status === 'ACCEPTED') && (
                          <button
                            disabled={actionLoading}
                            onClick={() => handleCancelRequest(req._id)}
                            className="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center"
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1.5" /> Cancel Booking
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

          </main>
        </div>
      </div>
    </PageTransition>
  );
}
