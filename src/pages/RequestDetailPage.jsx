import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Wrench, 
  Check, 
  X, 
  XCircle, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Phone,
  Mail,
  PlayCircle,
  CheckCheck,
  Star,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PageTransition from '../components/layout/PageTransition';
import StatusTimeline, { formatDuration } from '../components/common/StatusTimeline';
import ProblemPhotos from '../components/common/ProblemPhotos';
import { useAuth } from '../context/AuthContext';
import { 
  getRequestById, 
  acceptServiceRequest, 
  rejectServiceRequest, 
  startServiceRequest, 
  completeServiceRequest, 
  cancelServiceRequest 
} from '../services/requestService';
import { createReview, getMyCustomerReviews } from '../services/reviewService';

import ErrorState from '../components/common/ErrorState';

export default function RequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Existing Review state
  const [existingReview, setExistingReview] = useState(null);

  // Review Modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Other Modals State
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineNote, setDeclineNote] = useState('');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const fetchRequestDetails = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const res = await getRequestById(id);
      setRequest(res.data);

      if (user?.role === 'customer' && res.data.status === 'COMPLETED') {
        const myReviewsRes = await getMyCustomerReviews();
        const found = (myReviewsRes.data || []).find(r => r.serviceRequestId?._id === id || r.serviceRequestId === id);
        if (found) {
          setExistingReview(found);
        }
      }
    } catch (err) {
      console.error('Request detail fetch error:', err.message);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const handleAccept = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await acceptServiceRequest(id);
      setNotification('Service request accepted successfully!');
      await fetchRequestDetails();
    } catch (err) {
      setNotification(`Acceptance error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeclineSubmit = async (e) => {
    e.preventDefault();
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await rejectServiceRequest(id, declineNote);
      setNotification('Service request declined');
      setDeclineModalOpen(false);
      await fetchRequestDetails();
    } catch (err) {
      setNotification(`Decline error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartService = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await startServiceRequest(id);
      setNotification('Service started! Work is in progress.');
      await fetchRequestDetails();
    } catch (err) {
      setNotification(`Start error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteService = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await completeServiceRequest(id);
      setNotification('Service marked as completed successfully!');
      await fetchRequestDetails();
    } catch (err) {
      setNotification(`Completion error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelConfirm = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await cancelServiceRequest(id);
      setNotification('Service request cancelled');
      setCancelModalOpen(false);
      await fetchRequestDetails();
    } catch (err) {
      setNotification(`Cancellation error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (submittingReview) return;
    setSubmittingReview(true);
    try {
      const res = await createReview({
        serviceRequestId: id,
        rating,
        reviewText
      });
      setExistingReview(res.data);
      setReviewModalOpen(false);
      setNotification('Thank you for rating your service experience!');
    } catch (err) {
      setNotification(`Review error: ${err.message}`);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center space-x-3 text-slate-500 text-sm">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          <span>Loading booking details...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <ErrorState 
            title="Failed to Load Booking Details"
            message="We couldn't load details for this service booking from the server."
            onRetry={fetchRequestDetails}
          />
        </div>
        <Footer />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-center p-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl max-w-md w-full space-y-4">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Booking Record Not Found</h2>
            <p className="text-xs text-slate-500">The requested booking does not exist or you are not authorized to view it.</p>
            <button onClick={() => navigate(-1)} className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl">
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const customerName = request.customerId?.name || 'Customer';
  const customerPhone = request.customerId?.phone || 'N/A';
  const customerEmail = request.customerId?.email || 'N/A';

  const techName = request.technicianId?.userId?.name || request.technicianId?.name || 'Professional Expert';
  const techPhone = request.technicianId?.userId?.phone || 'N/A';

  const serviceName = request.serviceId?.name || 'Local Service';
  const dateStr = new Date(request.serviceDate).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const status = request.status;
  const bookingRef = request.bookingReference || `FX-2026-${request._id.substring(0, 6).toUpperCase()}`;

  const isCustomer = user?.role === 'customer';
  const isTechnician = user?.role === 'technician';

  const backLink = isTechnician ? '/technician/requests' : isCustomer ? '/customer/requests' : '/admin/requests';

  const ratingLabels = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        {/* Top Header */}
        <div className="bg-slate-900 text-white py-10 border-b border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
            <Link to={backLink} className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Bookings Overview
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950 px-2.5 py-0.5 rounded border border-blue-800">
                    REF: {bookingRef}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{serviceName} Category</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{request.problemTitle}</h1>
              </div>

              {/* Status Badge */}
              <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold border shrink-0 ${
                status === 'ACCEPTED'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : status === 'IN_PROGRESS'
                  ? 'bg-blue-950 text-blue-300 border-blue-800 animate-pulse'
                  : status === 'COMPLETED'
                  ? 'bg-purple-950 text-purple-300 border-purple-800'
                  : status === 'REJECTED'
                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                  : status === 'CANCELLED'
                  ? 'bg-slate-800 text-slate-400 border-slate-700'
                  : 'bg-amber-950 text-amber-300 border-amber-800'
              }`}>
                {status === 'ACCEPTED' ? '🟢 Confirmed Booking' : status === 'IN_PROGRESS' ? '🔵 Service In Progress' : status === 'COMPLETED' ? '🟣 Completed' : status === 'REJECTED' ? '🔴 Declined' : status === 'CANCELLED' ? '⚪ Cancelled' : '🟡 Pending Review'}
              </span>
            </div>
          </div>
        </div>

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

        {/* Content Workspace */}
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6 text-xs">
          
          {/* Status Progress Lifecycle Timeline */}
          <StatusTimeline 
            status={status} 
            createdAt={request.createdAt} 
            serviceStartedAt={request.serviceStartedAt} 
            completedAt={request.completedAt} 
          />

          {/* Main Details Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            
            {/* Customer Submitted Review Display if Completed */}
            {status === 'COMPLETED' && existingReview && (
              <div className="bg-purple-50 border border-purple-200 p-5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-slate-900 text-sm">Your Experience Review</span>
                    <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px] font-bold">✓ Verified</span>
                  </div>
                  <div className="flex items-center text-amber-500 space-x-1 font-bold">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-4 h-4 ${s <= existingReview.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    ))}
                    <span className="ml-1 text-slate-800">{existingReview.rating}/5</span>
                  </div>
                </div>
                {existingReview.reviewText && (
                  <p className="text-slate-700 italic text-xs bg-white p-3 rounded-xl border border-purple-100">
                    "{existingReview.reviewText}"
                  </p>
                )}
              </div>
            )}

            {/* Problem Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Problem Description</h3>
              <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed font-normal text-xs">
                "{request.problemDescription}"
              </p>
            </div>

            {/* Problem Photos */}
            <ProblemPhotos images={request.problemImages} />

            {/* Schedule & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-medium block">Scheduled Schedule</span>
                <div className="font-bold text-slate-900 text-sm flex items-center">
                  <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                  {dateStr} at {request.serviceTime}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-medium block">Service Location</span>
                <div className="font-bold text-slate-900 text-sm flex items-center">
                  <MapPin className="w-4 h-4 text-rose-500 mr-2 shrink-0" />
                  <span className="truncate">{request.address}, {request.city} ({request.postalCode})</span>
                </div>
              </div>
            </div>

            {/* Customer & Technician Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
              <div className="space-y-2">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Customer Information</span>
                <div className="space-y-1 font-medium text-slate-800">
                  <p className="font-bold text-sm text-slate-900">{customerName}</p>
                  <p className="flex items-center text-slate-600"><Phone className="w-3.5 h-3.5 mr-2 text-slate-400" /> {customerPhone}</p>
                  <p className="flex items-center text-slate-600"><Mail className="w-3.5 h-3.5 mr-2 text-slate-400" /> {customerEmail}</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Assigned Professional</span>
                <div className="space-y-1 font-medium text-slate-800">
                  <p className="font-bold text-sm text-slate-900">{techName}</p>
                  <p className="flex items-center text-slate-600"><Wrench className="w-3.5 h-3.5 mr-2 text-blue-600" /> {serviceName}</p>
                  <p className="flex items-center text-slate-600"><Phone className="w-3.5 h-3.5 mr-2 text-slate-400" /> {techPhone}</p>
                </div>
              </div>
            </div>

            {/* Phase 6 Action Controls */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-slate-400 text-[11px] block">Est. Rate Range</span>
                <span className="text-base font-extrabold text-emerald-600">{request.estimatedPrice || '₹800 – ₹1,200'}</span>
              </div>

              {/* Chat Button (Available for ACCEPTED, IN_PROGRESS, COMPLETED) */}
              {['ACCEPTED', 'IN_PROGRESS', 'COMPLETED'].includes(status) && (
                <button
                  onClick={() => navigate(isCustomer ? `/customer/requests/${id}/chat` : `/technician/requests/${id}/chat`)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 shrink-0"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{isCustomer ? 'Message Professional' : 'Message Customer'}</span>
                </button>
              )}

              {/* Technician Action Buttons */}
              {isTechnician && (
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  {status === 'PENDING' && (
                    <>
                      <button
                        disabled={actionLoading}
                        onClick={() => setDeclineModalOpen(true)}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        disabled={actionLoading}
                        onClick={handleAccept}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md hover:bg-emerald-700 transition-colors"
                      >
                        Accept Request
                      </button>
                    </>
                  )}

                  {status === 'ACCEPTED' && (
                    <button
                      disabled={actionLoading}
                      onClick={handleStartService}
                      className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
                      <span>Start Service</span>
                    </button>
                  )}

                  {status === 'IN_PROGRESS' && (
                    <button
                      disabled={actionLoading}
                      onClick={handleCompleteService}
                      className="w-full sm:w-auto px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
                      <span>Mark Service Completed</span>
                    </button>
                  )}
                </div>
              )}

              {/* Customer Action Buttons */}
              {isCustomer && (
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  {(status === 'PENDING' || status === 'ACCEPTED') && (
                    <button
                      disabled={actionLoading}
                      onClick={() => setCancelModalOpen(true)}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}

                  {status === 'COMPLETED' && !existingReview && (
                    <button
                      onClick={() => setReviewModalOpen(true)}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center space-x-2"
                    >
                      <Star className="w-4 h-4 fill-white" />
                      <span>Rate Professional & Review</span>
                    </button>
                  )}

                  {status === 'COMPLETED' && existingReview && (
                    <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 flex items-center">
                      <Check className="w-4 h-4 mr-1 text-emerald-600" /> ✓ Reviewed ({existingReview.rating}★)
                    </span>
                  )}
                </div>
              )}
            </div>

          </div>
        </main>

        {/* Phase 6 Review Submission Modal */}
        <AnimatePresence>
          {reviewModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.form 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onSubmit={handleReviewSubmit}
                className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative text-xs"
              >
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">How was your experience?</h3>
                    <p className="text-[11px] text-slate-500">Rate your service by {techName}</p>
                  </div>
                  <button type="button" onClick={() => setReviewModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Star Selection Widget */}
                <div className="flex flex-col items-center space-y-2 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isActiveStar = star <= (hoverRating || rating);
                      return (
                        <motion.button
                          key={star}
                          type="button"
                          whileHover={{ scale: 1.25 }}
                          whileTap={{ scale: 0.9 }}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="p-1 focus:outline-none"
                        >
                          <Star className={`w-7 h-7 transition-colors ${
                            isActiveStar ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`} />
                        </motion.button>
                      );
                    })}
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    {rating} / 5 stars — <strong className="text-blue-600">{ratingLabels[hoverRating || rating]}</strong>
                  </span>
                </div>

                {/* Review Textarea */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700">
                    <label>Tell us about your experience (optional)</label>
                    <span className="text-slate-400 font-medium">{reviewText.length} / 500</span>
                  </div>
                  <textarea
                    rows="4"
                    maxLength={500}
                    placeholder="Was the professional punctual, clean, polite, and skilled? Share your feedback to help others..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500 text-xs"
                  ></textarea>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:text-slate-800"
                  >
                    Maybe Later
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold shadow-md flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    {submittingReview ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Review</span>
                        <Check className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            </div>
          )}
        </AnimatePresence>

        {/* Decline Modal for Technician */}
        <AnimatePresence>
          {declineModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.form 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onSubmit={handleDeclineSubmit}
                className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-xs"
              >
                <h3 className="text-base font-bold text-slate-900 border-b pb-2">Decline Service Request</h3>
                <p className="text-slate-600">
                  Specify reason for declining <strong>"{request.problemTitle}"</strong>:
                </p>

                <textarea
                  rows="3"
                  required
                  placeholder="e.g. Schedule conflict, outside coverage..."
                  value={declineNote}
                  onChange={(e) => setDeclineNote(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-rose-500"
                ></textarea>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setDeclineModalOpen(false)}
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

        {/* Cancel Confirmation Modal for Customer */}
        <AnimatePresence>
          {cancelModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-xs"
              >
                <div className="flex items-center space-x-3 text-rose-600">
                  <AlertCircle className="w-6 h-6 shrink-0" />
                  <h3 className="text-base font-bold text-slate-900">Cancel Confirmed Booking?</h3>
                </div>

                <p className="text-slate-600 leading-relaxed">
                  Are you sure you want to cancel this booking ({bookingRef})? The assigned professional {techName} will be notified.
                </p>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCancelModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
                  >
                    Keep Booking
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={handleCancelConfirm}
                    className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-md"
                  >
                    Yes, Cancel Booking
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <Footer />
      </div>
    </PageTransition>
  );
}
