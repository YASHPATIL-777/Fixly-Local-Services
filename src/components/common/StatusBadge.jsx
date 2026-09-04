import React from 'react';
import { Clock, CheckCircle2, AlertCircle, XCircle, PlayCircle } from 'lucide-react';

export default function StatusBadge({ status, size = 'md' }) {
  const getBadgeStyle = () => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
        };
      case 'completed':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
        };
      case 'in progress':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          icon: <PlayCircle className="w-3.5 h-3.5 mr-1 animate-pulse" />
        };
      case 'pending':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <Clock className="w-3.5 h-3.5 mr-1" />
        };
      case 'rejected':
      case 'cancelled':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <XCircle className="w-3.5 h-3.5 mr-1" />
        };
      case 'urgent':
        return {
          bg: 'bg-red-100 text-red-800 border-red-300 font-semibold',
          icon: <AlertCircle className="w-3.5 h-3.5 mr-1 text-red-600" />
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: null
        };
    }
  };

  const style = getBadgeStyle();
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center rounded-full border ${style.bg} ${sizeClasses}`}>
      {style.icon}
      {status}
    </span>
  );
}
