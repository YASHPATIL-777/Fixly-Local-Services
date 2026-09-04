import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, 
  Check, 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Wrench,
  MessageSquare
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import PageTransition from '../components/layout/PageTransition';
import { getTechnicianRequests, acceptServiceRequest, rejectServiceRequest } from '../services/requestService';
import ErrorState from '../components/common/ErrorState';

export default function TechnicianRequestsPage() {
  const [activeTab, setActiveTab] = useState('requests');
  const [statusFilter, setStatusFilter] = useState('PENDING'); // 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'ALL'
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Decline Modal State
  const [declineModalReq, setDeclineModalReq] = useState(null);
  const [declineNote, setDeclineNote] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const res = await getTechnicianRequests(statusFilter);
      setRequests(res.data || []);
    } catch (err) {
      console.error('Technician requests fetch error:', err.message);
      setHasError(true);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const handleAccept = async (id, title) => {
    setActionLoading(true);
    try {
      await acceptServiceRequest(id);
      setNotification(`Accepted request: "${title}"`);
      await fetchRequests();
    } catch (err) {
      setNotification(`Error accepting request: ${err.message}`);
    } finally {
      setActionLoading(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDeclineSubmit = async (e) => {
    e.preventDefault();
    if (!declineModalReq) return;

    setActionLoading(true);
    try {
      await rejectServiceRequest(declineModalReq._id, declineNote);
      setNotification(`Declined request: "${declineModalReq.problemTitle}"`);
      setDeclineModalReq(null);
      setDeclineNote('');
      await fetchRequests();
    } catch (err) {
      setNotification(`Error declining request: ${err.message}`);
    } finally {
      setActionLoading(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex bg-slate-50">
        <Sidebar role="technician" activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Header */}
          <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-xs">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">Incoming Service Requests</h1>
              <p className="text-xs text-slate-500">Review, accept, or decline customer service requests</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              {['PENDING', 'ACCEPTED', 'REJECTED', 'ALL'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    statusFilter === st
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st === 'PENDING' ? 'New Requests' : st === 'ACCEPTED' ? 'Accepted' : st === 'REJECTED' ? 'Declined' : 'All'}
                </button>
              ))}
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

          {/* Main Content Workspace */}
          <main className="p-6 max-w-7xl w-full space-y-6">
            
            {loading ? (
              <div className="py-16 text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                <span>Loading service requests...</span>
              </div>
            ) : hasError ? (
              <ErrorState 
                title="Failed to Load Service Requests"
                message="We couldn't load your incoming service requests from the server."
                onRetry={fetchRequests}
              />
            ) : requests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 max-w-md mx-auto my-8 shadow-xs">
                <ClipboardList className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">No Requests Found</h3>
                <p className="text-xs text-slate-500">No customer service requests match status "{statusFilter}".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {requests.map((req) => {
                  const customerName = req.customerId?.name || 'Customer';
                  const customerPhone = req.customerId?.phone || '+91 98765 43210';
                  const serviceName = req.serviceId?.name || 'Plumbing Repair';
                  const dateStr = new Date(req.serviceDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                  const status = req.status;

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
                            <span className="text-xs font-mono font-bold text-slate-400">ID: {req._id.substring(0, 8)}</span>
                            <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-blue-50 text-blue-700 border border-blue-100">
                              {serviceName}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-slate-900">Customer: {customerName}</h3>
                          <p className="text-xs text-slate-500 font-semibold">{customerPhone}</p>
                        </div>

                        <div className="flex items-center space-x-3 shrink-0">
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                            {req.estimatedPrice || '₹800 – ₹1,200'}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            status === 'ACCEPTED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : status === 'REJECTED'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {status === 'ACCEPTED' ? '🟢 Accepted' : status === 'REJECTED' ? '🔴 Declined' : '🟡 New Pending'}
                          </span>
                        </div>
                      </div>

                      {/* Problem details */}
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900">{req.problemTitle}</h4>
                        <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 font-normal">
                          "{req.problemDescription}"
                        </p>
                      </div>

                      {/* Info bar */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                          <span>Scheduled: <strong>{dateStr} at {req.serviceTime}</strong></span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                          <span className="truncate">Location: {req.address}, {req.city}</span>
                        </div>
                      </div>

                      {/* Decline Reason if rejected */}
                      {status === 'REJECTED' && req.technicianResponseNote && (
                        <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-800">
                          <span className="font-bold">Decline Reason Provided:</span> "{req.technicianResponseNote}"
                        </div>
                      )}

                      {/* Action Controls */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/technician/requests/${req._id}`}
                            className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs rounded-xl transition-colors inline-flex items-center"
                          >
                            View Request Details →
                          </Link>

                          {['ACCEPTED', 'IN_PROGRESS', 'COMPLETED'].includes(status) && (
                            <Link
                              to={`/technician/requests/${req._id}/chat`}
                              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center space-x-1.5"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Message Customer</span>
                            </Link>
                          )}
                        </div>

                        {status === 'PENDING' && (
                          <div className="flex items-center space-x-3">
                            <button
                              disabled={actionLoading}
                              onClick={() => {
                                setDeclineModalReq(req);
                                setDeclineNote('');
                              }}
                              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-bold text-xs border border-slate-200 transition-colors flex items-center"
                            >
                              <X className="w-4 h-4 mr-1" /> Decline Request
                            </button>
                            <button
                              disabled={actionLoading}
                              onClick={() => handleAccept(req._id, req.problemTitle)}
                              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center"
                            >
                              <Check className="w-4 h-4 mr-1" /> Accept Request
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

          </main>
        </div>

        {/* Decline Reason Modal */}
        <AnimatePresence>
          {declineModalReq && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.form 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onSubmit={handleDeclineSubmit}
                className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative"
              >
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-base font-bold text-slate-900">Decline Service Request</h3>
                  <button type="button" onClick={() => setDeclineModalReq(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs text-slate-600">
                  Please specify why you are declining the request for <strong>"{declineModalReq.problemTitle}"</strong>:
                </p>

                <textarea
                  rows="3"
                  required
                  placeholder="e.g. Not available at requested schedule, outside service area..."
                  value={declineNote}
                  onChange={(e) => setDeclineNote(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-rose-500"
                ></textarea>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setDeclineModalReq(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-md"
                  >
                    Confirm Decline
                  </button>
                </div>
              </motion.form>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
