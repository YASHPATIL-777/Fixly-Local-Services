import React from 'react';
import { Calendar, Clock, MapPin, Phone, User, Wrench, ChevronRight } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function BookingCard({ booking }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="bg-slate-900 text-white p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Booking ID: {booking.id}</span>
            <h3 className="text-lg font-bold text-white leading-tight">{booking.service}</h3>
          </div>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-5">
        {/* Technician Info */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center space-x-3">
            {booking.technicianAvatar ? (
              <img 
                src={booking.technicianAvatar} 
                alt={booking.technicianName}
                className="w-12 h-12 rounded-lg object-cover border border-slate-200" 
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                {booking.technicianName?.[0]}
              </div>
            )}
            <div>
              <span className="text-xs text-slate-500 font-medium">Assigned Technician</span>
              <h4 className="text-sm font-bold text-slate-900">{booking.technicianName}</h4>
            </div>
          </div>
          {booking.technicianPhone && (
            <a 
              href={`tel:${booking.technicianPhone}`} 
              className="inline-flex items-center text-xs font-semibold px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 mr-1.5" />
              Call
            </a>
          )}
        </div>

        {/* Schedule & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start space-x-2.5 p-3 rounded-lg bg-slate-50/60 border border-slate-100">
            <Calendar className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-500 font-medium">Date & Time</span>
              <p className="font-semibold text-slate-800 text-sm mt-0.5">{booking.date} at {booking.time}</p>
            </div>
          </div>
          <div className="flex items-start space-x-2.5 p-3 rounded-lg bg-slate-50/60 border border-slate-100">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-500 font-medium">Service Address</span>
              <p className="font-semibold text-slate-800 text-sm mt-0.5 truncate">{booking.location}</p>
            </div>
          </div>
        </div>

        {/* Issue Description */}
        {booking.problem && (
          <div className="text-xs space-y-1">
            <span className="text-slate-500 font-medium">Problem Description</span>
            <p className="p-3 bg-slate-50 rounded-lg text-slate-700 border border-slate-100 leading-relaxed">
              "{booking.problem}"
            </p>
          </div>
        )}

        {/* Actions Footer */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <div className="text-xs text-slate-500">
            Estimated Charges: <span className="font-bold text-slate-900 text-sm">{booking.estimatedCost || '₹450'}</span>
          </div>
          <button className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700">
            View Service Receipt <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
