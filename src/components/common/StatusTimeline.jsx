import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, PlayCircle, CheckCheck, XCircle, AlertCircle } from 'lucide-react';

// Utility helper to format service duration between two dates
export const formatDuration = (start, end) => {
  if (!start || !end) return null;
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate - startDate;
  if (diffMs <= 0) return 'Under 1m';

  const totalMins = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

export default function StatusTimeline({ status, createdAt, serviceStartedAt, completedAt }) {
  if (status === 'REJECTED') {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-xs text-rose-800 space-y-1">
        <div className="flex items-center font-bold text-sm text-rose-900">
          <XCircle className="w-5 h-5 text-rose-600 mr-2" /> Request Declined
        </div>
        <p className="text-slate-600">The professional was unable to accept this request at the scheduled time.</p>
      </div>
    );
  }

  if (status === 'CANCELLED') {
    return (
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 text-xs text-slate-700 space-y-1">
        <div className="flex items-center font-bold text-sm text-slate-900">
          <AlertCircle className="w-5 h-5 text-slate-500 mr-2" /> Request Cancelled
        </div>
        <p className="text-slate-500">This service request was cancelled by the customer.</p>
      </div>
    );
  }

  const steps = [
    {
      id: 1,
      title: 'Request Sent',
      subtitle: createdAt ? new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Submitted',
      statusKey: 'PENDING'
    },
    {
      id: 2,
      title: 'Professional Accepted',
      subtitle: status === 'PENDING' ? 'Awaiting Tech Review' : 'Confirmed',
      statusKey: 'ACCEPTED'
    },
    {
      id: 3,
      title: 'Service In Progress',
      subtitle: serviceStartedAt ? `Started at ${new Date(serviceStartedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Waiting for Service',
      statusKey: 'IN_PROGRESS'
    },
    {
      id: 4,
      title: 'Service Completed',
      subtitle: completedAt ? `Completed (${formatDuration(serviceStartedAt, completedAt)})` : 'Final Step',
      statusKey: 'COMPLETED'
    }
  ];

  // Helper to determine step completion index
  const getActiveStepIndex = () => {
    switch (status) {
      case 'PENDING': return 1;
      case 'ACCEPTED': return 2;
      case 'IN_PROGRESS': return 3;
      case 'COMPLETED': return 4;
      default: return 1;
    }
  };

  const activeIndex = getActiveStepIndex();

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Service Progress Lifecycle</h3>
        {completedAt && serviceStartedAt && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
            Total Duration: {formatDuration(serviceStartedAt, completedAt)}
          </span>
        )}
      </div>

      {/* Horizontal / Vertical Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
        {steps.map((step) => {
          const isDone = step.id < activeIndex || (step.id === 4 && status === 'COMPLETED');
          const isCurrent = step.id === activeIndex && status !== 'COMPLETED';

          return (
            <div key={step.id} className="flex flex-col items-center text-center space-y-2 relative z-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: step.id * 0.1 }}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shadow-sm transition-all border ${
                  isDone
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : isCurrent
                    ? 'bg-blue-600 text-white border-blue-600 ring-4 ring-blue-100 animate-pulse'
                    : 'bg-white text-slate-400 border-slate-200'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : isCurrent ? (
                  step.id === 3 ? <PlayCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />
                ) : (
                  <span>{step.id}</span>
                )}
              </motion.div>

              <div className="space-y-0.5">
                <span className={`text-xs font-bold block ${isDone ? 'text-emerald-700' : isCurrent ? 'text-blue-600' : 'text-slate-400'}`}>
                  {step.title}
                </span>
                <span className="text-[11px] text-slate-500 font-medium block">
                  {step.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
