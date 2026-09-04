import React from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from '../common/AnimatedCounter';

export default function DashboardCard({ title, value, icon: Icon, trend, color = 'blue' }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100'
  };

  return (
    <motion.div 
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between"
    >
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">
          <AnimatedCounter value={value} />
        </h3>
        {trend && (
          <p className="text-xs text-slate-500 mt-1 flex items-center">
            <span className="text-emerald-600 font-semibold mr-1">{trend}</span> vs last month
          </p>
        )}
      </div>
      {Icon && (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorMap[color]}`}>
          <Icon className="w-6 h-6 stroke-[2]" />
        </div>
      )}
    </motion.div>
  );
}
