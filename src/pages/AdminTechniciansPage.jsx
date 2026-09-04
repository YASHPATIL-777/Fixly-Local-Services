import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Star,
  MapPin,
  Award,
  X
} from 'lucide-react';
import AdminSidebar from '../components/layout/AdminSidebar';
import PageTransition from '../components/layout/PageTransition';
import { getAdminTechnicians, verifyTechnicianAdmin } from '../services/adminService';

export default function AdminTechniciansPage() {
  const [statusFilter, setStatusFilter] = useState('pending'); // 'pending' | 'approved' | 'rejected' | 'all'
  const [searchTerm, setSearchTerm] = useState('');
  const [technicians, setTechnicians] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Rejection Modal State
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchTechnicians = async () => {
    setLoading(true);
    try {
      const res = await getAdminTechnicians(statusFilter, searchTerm, page, 10);
      setTechnicians(res.data.technicians || []);
      setTotalPages(res.data.pages || 1);
      setTotalCount(res.data.totalTechnicians || 0);
    } catch (err) {
      setNotification(`Failed to load technicians: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTechnicians();
    }, 300);
    return () => clearTimeout(timer);
  }, [statusFilter, searchTerm, page]);

  const handleApprove = async (techId) => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await verifyTechnicianAdmin(techId, 'approved', 'Verified by FixNear administrator.');
      setNotification('Technician profile approved! Verification notification sent.');
      await fetchTechnicians();
    } catch (err) {
      setNotification(`Approval error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (actionLoading || !selectedTech) return;
    setActionLoading(true);
    try {
      await verifyTechnicianAdmin(selectedTech._id, 'rejected', rejectionReason);
      setNotification('Technician application rejected. Rejection notification sent.');
      setRejectionModalOpen(false);
      setRejectionReason('');
      setSelectedTech(null);
      await fetchTechnicians();
    } catch (err) {
      setNotification(`Rejection error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex bg-slate-950 text-white">
        <AdminSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Header */}
          <header className="bg-slate-900 border-b border-slate-800 px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10">
            <div>
              <h1 className="text-xl font-extrabold text-white">Technician Verification Queue</h1>
              <p className="text-xs text-slate-400">Total Registered Professionals: {totalCount}</p>
            </div>

            <div className="flex items-center space-x-3">
              {/* Filter Tabs */}
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                {['pending', 'approved', 'rejected', 'all'].map((st) => (
                  <button
                    key={st}
                    onClick={() => { setStatusFilter(st); setPage(1); }}
                    className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                      statusFilter === st ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
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

          {/* Content */}
          <main className="p-8 max-w-7xl w-full space-y-6 text-xs">
            
            {loading ? (
              <div className="py-16 text-center text-slate-400 flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                <span>Loading technician applications...</span>
              </div>
            ) : technicians.length === 0 ? (
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center text-slate-400 space-y-2">
                <p className="font-bold text-white text-base">No Technicians Found</p>
                <p>No technician applications match status "{statusFilter}".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {technicians.map((tech) => {
                  const name = tech.userId?.name || 'Technician';
                  const email = tech.userId?.email || 'N/A';
                  const phone = tech.userId?.phone || 'N/A';
                  const vStatus = tech.verificationStatus;

                  return (
                    <div key={tech._id} className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                          <div>
                            <h3 className="text-base font-extrabold text-white">{name}</h3>
                            <p className="text-blue-400 text-xs font-bold">{tech.serviceCategory || 'Plumbing Service'}</p>
                          </div>

                          <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold border ${
                            vStatus === 'approved'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : vStatus === 'rejected'
                              ? 'bg-rose-950 text-rose-300 border-rose-800'
                              : 'bg-amber-950 text-amber-300 border-amber-800'
                          }`}>
                            {vStatus === 'approved' ? '🟢 APPROVED' : vStatus === 'rejected' ? '🔴 REJECTED' : '🟡 PENDING VERIFICATION'}
                          </span>
                        </div>

                        {/* Bio & Details */}
                        <p className="text-slate-300 text-xs bg-slate-950 p-3 rounded-xl border border-slate-850 leading-relaxed font-normal">
                          "{tech.bio || 'Experienced local technician available for residential repairs and service calls.'}"
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-slate-400 pt-1">
                          <div>Experience: <strong className="text-white">{tech.experienceYears || 5} yrs</strong></div>
                          <div>Location: <strong className="text-white">{tech.location || 'Thane'}</strong></div>
                          <div>Hourly Rate: <strong className="text-emerald-400">{tech.hourlyRate || '₹800 – ₹1,200'}</strong></div>
                          <div>Rating: <strong className="text-amber-400">{tech.rating || 5.0} ★ ({tech.totalReviews || 0})</strong></div>
                        </div>

                        {tech.verificationNote && (
                          <div className="text-[11px] text-slate-400 italic bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                            Verification Note: "{tech.verificationNote}"
                          </div>
                        )}
                      </div>

                      {/* Action Bar */}
                      <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
                        {vStatus === 'pending' && (
                          <>
                            <button
                              disabled={actionLoading}
                              onClick={() => { setSelectedTech(tech); setRejectionModalOpen(true); }}
                              className="px-4 py-2 bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900 font-bold text-xs rounded-xl transition-colors"
                            >
                              Reject
                            </button>
                            <button
                              disabled={actionLoading}
                              onClick={() => handleApprove(tech._id)}
                              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                            >
                              Approve Technician
                            </button>
                          </>
                        )}

                        {vStatus === 'approved' && (
                          <button
                            disabled={actionLoading}
                            onClick={() => { setSelectedTech(tech); setRejectionModalOpen(true); }}
                            className="px-4 py-2 bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-300 font-bold text-xs rounded-xl transition-colors border border-slate-700"
                          >
                            Revoke / Reject
                          </button>
                        )}

                        {vStatus === 'rejected' && (
                          <button
                            disabled={actionLoading}
                            onClick={() => handleApprove(tech._id)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                          >
                            Re-Approve Technician
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </main>
        </div>

        {/* Rejection Reason Modal */}
        <AnimatePresence>
          {rejectionModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.form 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onSubmit={handleRejectSubmit}
                className="bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-800 relative text-xs"
              >
                <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">Reject Technician Application</h3>
                <p className="text-slate-300 leading-relaxed">
                  Please provide a reason for rejecting <strong>"{selectedTech?.userId?.name || 'Technician'}"</strong>:
                </p>

                <textarea
                  rows="3"
                  required
                  placeholder="e.g. Incomplete experience documents, invalid location..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-rose-500 text-xs"
                ></textarea>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setRejectionModalOpen(false); setSelectedTech(null); }}
                    className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 font-bold hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 shadow-md"
                  >
                    Reject Technician
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
