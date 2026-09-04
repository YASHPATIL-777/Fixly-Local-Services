import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ShieldCheck, Award } from 'lucide-react';
import RatingStars from '../common/RatingStars';
import { getTechnicianRoutePath } from '../../utils/routeUtils';

export default function TechnicianCard({ technician, onBook }) {
  if (!technician) return null;

  const techId = technician._id || technician.id;
  const techName = technician.userId?.name || technician.name || 'Professional Expert';
  const techService = technician.serviceCategory || (technician.serviceIds && technician.serviceIds.length > 0 ? (technician.serviceIds[0].name || technician.serviceIds[0]) : '') || technician.service || 'Service Professional';
  const techAvatar = technician.profileImage || technician.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=250';
  const isVerified = technician.verificationStatus === 'approved' || technician.verified;
  const rating = technician.rating || 4.8;
  const reviewsCount = technician.totalReviews || technician.reviewsCount || 12;
  const experienceYears = technician.experienceYears || 5;
  const location = technician.location || 'Thane';
  const hourlyRate = technician.hourlyRate || '₹800 – ₹1,200';
  const profileUrl = getTechnicianRoutePath(techId);

  return (
    <motion.div 
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all flex flex-col justify-between"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative shrink-0 overflow-hidden rounded-xl">
            <motion.img 
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.3 }}
              src={techAvatar} 
              alt={techName}
              className="w-16 h-16 object-cover border border-slate-200 shadow-xs"
            />
            {isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5" title="Verified Professional">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 truncate">
                {techName}
              </h3>
            </div>
            <span className="inline-block px-2.5 py-0.5 text-xs font-bold rounded bg-blue-50 text-blue-700 mt-1 border border-blue-100 truncate max-w-full">
              {techService}
            </span>
            <div className="mt-2">
              <RatingStars rating={rating} reviewsCount={reviewsCount} />
            </div>
          </div>
        </div>

        {/* Bio */}
        {technician.bio && (
          <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed mb-4 font-normal">
            {technician.bio}
          </p>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-slate-100 mb-4 bg-slate-50/70 rounded-xl px-3">
          <div className="flex items-center text-slate-600">
            <Award className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
            <span>{experienceYears} yrs exp.</span>
          </div>
          <div className="flex items-center text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between space-x-3 pt-1">
        <div>
          <span className="text-[10px] text-slate-400 font-medium block uppercase">Est. Rate</span>
          <div className="text-slate-900 font-bold text-sm">
            {hourlyRate}
          </div>
        </div>

        {onBook ? (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onBook(technician)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-blue-600 transition-colors shadow-xs"
          >
            View Profile
          </motion.button>
        ) : (
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              to={profileUrl}
              className="inline-block px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-blue-600 transition-colors shadow-xs"
            >
              View Profile
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
