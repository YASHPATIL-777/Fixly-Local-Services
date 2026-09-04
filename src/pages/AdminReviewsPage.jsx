import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Trash2, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  X,
  MessageSquare
} from 'lucide-react';
import AdminSidebar from '../components/layout/AdminSidebar';
import PageTransition from '../components/layout/PageTransition';
import { getAdminReviewsList, deleteAdminReview } from '../services/adminService';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Moderate Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await getAdminReviewsList(page, 10);
      setReviews(res.data.reviews || []);
      setTotalPages(res.data.pages || 1);
      setTotalCount(res.data.totalReviews || 0);
    } catch (err) {
      setNotification(`Failed to load reviews: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const handleDeleteConfirm = async () => {
    if (actionLoading || !selectedReview) return;
    setActionLoading(true);
    try {
      await deleteAdminReview(selectedReview._id);
      setNotification('Review moderated and deleted. Technician rating recalculated.');
      setDeleteModalOpen(false);
      setSelectedReview(null);
      await fetchReviews();
    } catch (err) {
      setNotification(`Moderation error: ${err.message}`);
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
          <header className="bg-slate-900 border-b border-slate-800 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
            <div>
              <h1 className="text-xl font-extrabold text-white">Reviews Moderation</h1>
              <p className="text-xs text-slate-400">Total Customer Reviews: {totalCount}</p>
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
                <span>Loading customer reviews...</span>
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center text-slate-400 space-y-2">
                <p className="font-bold text-white text-base">No Reviews Available</p>
                <p>Submitted service ratings will appear here for admin moderation.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {reviews.map((rev) => {
                  const customerName = rev.customerId?.name || 'Customer';
                  const techName = rev.technicianId?.userId?.name || 'Technician';

                  return (
                    <div key={rev._id} className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-3 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className={`w-4 h-4 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                            ))}
                          </div>
                          <span className="font-bold text-white">{rev.rating} / 5</span>
                        </div>

                        {rev.reviewText && (
                          <p className="text-slate-300 italic text-xs bg-slate-950 p-3 rounded-xl border border-slate-850">
                            "{rev.reviewText}"
                          </p>
                        )}

                        <div className="flex items-center space-x-4 text-slate-400 text-[11px] pt-1">
                          <span>Customer: <strong className="text-white">{customerName}</strong></span>
                          <span>Technician: <strong className="text-blue-400">{techName}</strong></span>
                          <span>Date: {new Date(rev.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <button
                          disabled={actionLoading}
                          onClick={() => { setSelectedReview(rev); setDeleteModalOpen(true); }}
                          className="px-4 py-2 bg-rose-950 hover:bg-rose-900 text-rose-300 font-bold text-xs rounded-xl border border-rose-800 transition-colors flex items-center space-x-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Moderate Review</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </main>
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-800 text-xs"
              >
                <div className="flex items-center space-x-3 text-rose-500">
                  <AlertCircle className="w-6 h-6 shrink-0" />
                  <h3 className="text-base font-bold text-white">Moderate & Delete Review?</h3>
                </div>

                <p className="text-slate-300 leading-relaxed">
                  Are you sure you want to remove this review? The technician's overall rating and total review count will be recalculated automatically.
                </p>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setDeleteModalOpen(false); setSelectedReview(null); }}
                    className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 font-bold hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={handleDeleteConfirm}
                    className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 shadow-md"
                  >
                    Delete & Recalculate
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
}
