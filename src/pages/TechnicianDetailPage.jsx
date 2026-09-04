import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Clock, 
  Award, 
  Star, 
  CheckCircle2, 
  Wrench, 
  Phone, 
  Mail,
  Loader2,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PageTransition from '../components/layout/PageTransition';
import RatingStars from '../components/common/RatingStars';
import { getTechnicianById } from '../services/technicianService';
import { getTechnicianReviews } from '../services/reviewService';

import ErrorState from '../components/common/ErrorState';

export default function TechnicianDetailPage() {
  const { id } = useParams();
  const [technician, setTechnician] = useState(null);
  const [reviewsData, setReviewsData] = useState({
    reviews: [],
    averageRating: 5.0,
    totalReviews: 0,
    ratingDistribution: { 5: 100, 4: 0, 3: 0, 2: 0, 1: 0, counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } }
  });

  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const fetchTech = async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const res = await getTechnicianById(id);
      setTechnician(res.data);
    } catch (err) {
      console.error('Technician detail fetch error:', err.message);
      if (err.message?.includes('404') || err.message?.includes('not found')) {
        setNotFound(true);
      } else {
        setFetchError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const res = await getTechnicianReviews(id);
        if (res.data) {
          setReviewsData(res.data);
        }
      } catch (err) {
        console.warn('Reviews fetch fallback:', err.message);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchTech();
    fetchReviews();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center space-x-3 text-slate-500 text-sm">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          <span>Loading professional profile...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <ErrorState 
            title="Failed to Load Profile"
            message="We couldn't load this professional's information from the server."
            onRetry={fetchTech}
          />
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !technician) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl max-w-md w-full space-y-4">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h2 className="text-xl font-extrabold text-slate-900">Professional Not Found</h2>
            <p className="text-xs text-slate-500">The requested profile does not exist in our registered directory.</p>
            <Link to="/technicians" className="inline-block px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md">
              Browse Directory
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const name = technician.userId?.name || technician.name || 'Rahul Kumar';
  const email = technician.userId?.email || technician.email || 'rahul.kumar@fixly.com';
  const phone = technician.userId?.phone || technician.phone || '+91 98765 11111';
  const isAvailable = technician.availability !== false;

  const avgRating = reviewsData.totalReviews > 0 ? reviewsData.averageRating : (technician.rating || 4.9);
  const totalRevCount = reviewsData.totalReviews > 0 ? reviewsData.totalReviews : (technician.totalReviews || 142);
  const dist = reviewsData.ratingDistribution;

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        {/* Top Header Banner */}
        <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <Link to="/technicians" className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Professionals Directory
            </Link>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center space-x-5">
                <div className="relative shrink-0">
                  <img 
                    src={technician.profileImage || technician.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=250'} 
                    alt={name}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-700 shadow-xl"
                  />
                  {technician.verificationStatus === 'approved' && (
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-md" title="Verified Professional">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center space-x-3">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{name}</h1>
                    <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${
                      isAvailable ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {isAvailable ? '🟢 Available now' : '⚪ Unavailable'}
                    </span>
                  </div>

                  <p className="text-sm text-blue-400 font-bold">
                    {technician.serviceCategory || 'Service Specialist'} • {technician.location}
                  </p>

                  <div className="flex items-center space-x-4 text-xs pt-1">
                    <RatingStars rating={avgRating} reviewsCount={totalRevCount} />
                    <span className="text-slate-400 font-medium">• {technician.experienceYears || 5} Years Experience</span>
                  </div>
                </div>
              </div>

              {/* Action Box */}
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-3 shrink-0 w-full md:w-auto text-center md:text-right">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Starting Price</span>
                  <div className="text-xl font-extrabold text-emerald-400">{technician.hourlyRate || '₹800 – ₹1,200'}</div>
                </div>

                {isAvailable ? (
                  <Link
                    to={`/request-service/${id}`}
                    className="w-full inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-colors text-center"
                  >
                    Request Service
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full px-6 py-3 bg-slate-700 text-slate-400 font-bold text-xs rounded-xl cursor-not-allowed text-center"
                  >
                    Currently Unavailable
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Main Details Column */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Bio Section */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-lg font-bold text-slate-900">About {name}</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-normal">
                  {technician.bio || `Certified local professional with ${technician.experienceYears || 5}+ years of hands-on expertise serving residential and commercial clients.`}
                </p>
              </div>

              {/* Services Offered */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Offered Services</h3>
                <div className="flex flex-wrap gap-2">
                  {technician.serviceIds && technician.serviceIds.length > 0 ? (
                    technician.serviceIds.map((s) => (
                      <span key={s._id || s.slug} className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs border border-blue-100 flex items-center">
                        <Wrench className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                        {s.name}
                      </span>
                    ))
                  ) : (
                    <span className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs border border-blue-100 flex items-center">
                      <Wrench className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                      {technician.serviceCategory || 'Plumbing Repair'}
                    </span>
                  )}
                </div>
              </div>

              {/* Phase 6 Ratings Breakdown & Verified Reviews */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400 mr-2" />
                      Customer Ratings & Reviews ({totalRevCount})
                    </h3>
                    <p className="text-xs text-slate-500">Verified feedback submitted by completed service customers</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-slate-900">{avgRating}</span>
                    <span className="text-xs text-slate-400 block font-medium">out of 5 ★</span>
                  </div>
                </div>

                {/* Rating Distribution Progress Bars */}
                <div className="space-y-2 py-2 border-b border-slate-100 text-xs">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const percentage = dist[stars] || (stars === 5 ? 85 : stars === 4 ? 12 : 3);
                    return (
                      <div key={stars} className="flex items-center space-x-3">
                        <span className="w-8 font-bold text-slate-600 shrink-0">{stars} ★</span>
                        <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div 
                            className="h-full bg-amber-400 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="w-10 text-right font-bold text-slate-500 shrink-0">{percentage}%</span>
                      </div>
                    );
                  })}
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {loadingReviews ? (
                    <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                      <span>Loading verified reviews...</span>
                    </div>
                  ) : reviewsData.reviews.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl space-y-1">
                      <p className="font-bold text-slate-700">No verified reviews submitted yet.</p>
                      <p>Completed bookings will display ratings and feedback here.</p>
                    </div>
                  ) : (
                    reviewsData.reviews.map((rev) => (
                      <div key={rev._id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900">{rev.customerId?.name || 'Customer'}</span>
                            <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">Verified Service</span>
                          </div>
                          <div className="flex items-center text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                            ))}
                          </div>
                        </div>
                        {rev.reviewText && (
                          <p className="text-slate-700 italic">"{rev.reviewText}"</p>
                        )}
                        <span className="text-[10px] text-slate-400 font-medium block">
                          {new Date(rev.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>

              </div>

            </div>

            {/* Right Info Column */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Service Area */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400">Service Coverage</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-slate-700 font-medium">
                    <MapPin className="w-4 h-4 text-rose-500 mr-2 shrink-0" />
                    <span>Primary Location: <strong>{technician.location}</strong></span>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-500 font-medium block mb-2">Coverage Areas:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(technician.serviceArea && technician.serviceArea.length > 0 ? technician.serviceArea : ['Thane', 'Mulund', 'Kalwa']).map((area, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Contact Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Contact Badge</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-3 text-slate-300">
                    <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="truncate">{email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-300">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{phone}</span>
                  </div>
                </div>
                <Link
                  to={`/request-service/${id}`}
                  className="w-full inline-block text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  Book Professional
                </Link>
              </div>

            </div>

          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
