import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, 
  Search, 
  Loader2, 
  Calendar, 
  MapPin, 
  User, 
  Wrench, 
  X, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import AdminSidebar from '../components/layout/AdminSidebar';
import PageTransition from '../components/layout/PageTransition';
import { getAdminRequestsList } from '../services/adminService';

export default function AdminRequestsPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getAdminRequestsList(statusFilter, searchTerm, page, 10);
      
      // Safe array extraction handling both res.data.requests and array responses
      const requestArray = Array.isArray(res.data?.requests)
        ? res.data.requests
        : Array.isArray(res.data)
        ? res.data
        : [];

      setRequests(requestArray);
      setTotalPages(res.data?.pages || 1);
      setTotalCount(res.data?.totalRequests || requestArray.length);
    } catch (err) {
      setNotification(`Failed to load service requests: ${err.message}`);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRequests();
    }, 300);
    return () => clearTimeout(timer);
  }, [statusFilter, searchTerm, page]);

  // Safe array normalization guard for rendering
  const requestList = Array.isArray(requests) ? requests : [];

  return (
    <PageTransition>
      <div className="min-h-screen flex bg-slate-950 text-white">
        {/* Admin Sidebar */}
        <AdminSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Header */}
          <header className="bg-slate-900 border-b border-slate-800 px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10">
            <div>
              <h1 className="text-xl font-extrabold text-white">Service Requests Monitoring</h1>
              <p className="text-xs text-slate-400">Total Platform Requests Recorded: {totalCount}</p>
            </div>

            <div className="flex items-center space-x-3">
              {/* Search Bar */}
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Ref, Title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Status Filter */}
              <div className="hidden sm:flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                {['all', 'pending', 'accepted', 'in_progress', 'completed', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => { setStatusFilter(st); setPage(1); }}
                    className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                      statusFilter === st ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st === 'in_progress' ? 'In Progress' : st}
                  </button>
                ))}
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

          {/* Main Content Workspace */}
          <main className="p-8 max-w-7xl w-full space-y-6 text-xs">
            
            {loading ? (
              <div className="py-16 text-center text-slate-400 flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                <span>Loading all platform service requests...</span>
              </div>
            ) : requestList.length === 0 ? (
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center text-slate-400 space-y-2">
                <p className="font-bold text-white text-base">No Service Requests Found</p>
                <p>No requests match status "{statusFilter}".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {requestList.map((req) => {
                  const customerName = req.customerId?.name || 'Customer';
                  const techName = req.technicianId?.userId?.name || req.technicianId?.name || 'Technician';
                  const serviceName = req.serviceId?.name || 'Service';
                  const dateStr = new Date(req.serviceDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                  const bookingRef = req.bookingReference || `FX-2026-${req._id.substring(0, 6).toUpperCase()}`;

                  return (
                    <div key={req._id} className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-3">
                            <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950 px-2.5 py-0.5 rounded border border-blue-800">
                              REF: {bookingRef}
                            </span>
                            <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-slate-800 text-slate-300">
                              {serviceName}
                            </span>
                          </div>
                          <h3 className="text-base font-extrabold text-white">{req.problemTitle}</h3>
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0">
                          <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                            req.status === 'ACCEPTED'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : req.status === 'IN_PROGRESS'
                              ? 'bg-blue-950 text-blue-300 border-blue-800'
                              : req.status === 'COMPLETED'
                              ? 'bg-purple-950 text-purple-300 border-purple-800'
                              : req.status === 'REJECTED'
                              ? 'bg-rose-950 text-rose-300 border-rose-800'
                              : req.status === 'CANCELLED'
                              ? 'bg-slate-800 text-slate-400 border-slate-700'
                              : 'bg-amber-950 text-amber-300 border-amber-800'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                      </div>

                      {/* Problem Description */}
                      <p className="text-slate-300 text-xs bg-slate-950 p-3 rounded-xl border border-slate-850 font-normal">
                        "{req.problemDescription}"
                      </p>

                      {/* Request Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-400 text-xs pt-1">
                        <div className="flex items-center space-x-2">
                          <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>Customer: <strong className="text-white">{customerName}</strong></span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Wrench className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span>Technician: <strong className="text-blue-300">{techName}</strong></span>
                        </div>
                        <div className="flex items-center space-x-2 sm:justify-end">
                          <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>Schedule: <strong className="text-white">{dateStr} ({req.serviceTime})</strong></span>
                        </div>
                      </div>

                      {/* Address Bar */}
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 mr-1.5 shrink-0" />
                          Location: {req.address}, {req.city} ({req.postalCode})
                        </span>
                        <span className="font-extrabold text-emerald-400">
                          Est. Price: {req.estimatedPrice || '₹800 – ₹1,200'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1.5 bg-slate-950 text-slate-300 hover:bg-slate-850 font-bold rounded-lg disabled:opacity-50"
                >
                  ← Previous Page
                </button>
                <span className="text-slate-400 font-medium">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1.5 bg-slate-950 text-slate-300 hover:bg-slate-850 font-bold rounded-lg disabled:opacity-50"
                >
                  Next Page →
                </button>
              </div>
            )}

          </main>
        </div>
      </div>
    </PageTransition>
  );
}
