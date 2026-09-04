import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench, Zap, Wind, Hammer, Sparkles, Tv, Paintbrush, Grid, ArrowUpRight, Car } from 'lucide-react';
import { getServiceRoutePath } from '../../utils/routeUtils';

const iconMap = {
  Wrench,
  Zap,
  Wind,
  Hammer,
  Sparkles,
  Tv,
  Paintbrush,
  Grid,
  Car
};

export default function ServiceCard({ service, featured = false, onSelect, motionProps }) {
  const navigate = useNavigate();
  const IconComponent = iconMap[service.icon] || Wrench;
  const targetSlug = service.slug || service.id;
  const serviceUrl = getServiceRoutePath(targetSlug);

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(service);
    } else {
      navigate(serviceUrl);
    }
  };

  return (
    <motion.div 
      {...motionProps}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.2, ease: 'easeOut', ...(motionProps?.transition || {}) }}
      onClick={handleCardClick}
      className={`group rounded-2xl p-6 transition-all flex flex-col justify-between cursor-pointer border h-full ${
        featured
          ? 'bg-[#121624] text-white border-slate-800 shadow-xl hover:border-blue-500/50'
          : 'bg-white text-slate-900 border-slate-200/90 shadow-xs hover:shadow-lg hover:border-blue-500/40'
      }`}
    >
      <div className="space-y-4">
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
            featured
              ? 'bg-blue-600 text-white'
              : 'bg-slate-900 text-blue-400 group-hover:bg-blue-600 group-hover:text-white'
          }`}>
            <IconComponent className="w-5 h-5 stroke-[2] group-hover:scale-105 transition-transform" />
          </div>

          <div className="flex items-center space-x-2">
            {featured ? (
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 uppercase tracking-wider">
                High Demand
              </span>
            ) : service.badge ? (
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
                {service.badge}
              </span>
            ) : null}

            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5 ${
              featured ? 'text-slate-400 group-hover:text-white' : 'text-slate-400 group-hover:text-blue-600'
            }`}>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className={`text-lg font-extrabold tracking-tight mb-1.5 transition-colors ${
            featured ? 'text-white' : 'group-hover:text-blue-600 text-slate-900'
          }`}>
            {service.name}
          </h3>

          <p className={`text-xs leading-relaxed font-normal line-clamp-2 ${
            featured ? 'text-slate-300' : 'text-slate-500'
          }`}>
            {service.description}
          </p>
        </div>
      </div>

      {/* Footer Divider & Pricing Bar */}
      <div className={`mt-5 pt-4 border-t flex items-center justify-between text-xs ${
        featured ? 'border-slate-800/90' : 'border-slate-100'
      }`}>
        <div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Starts from</span>
          <span className={`text-sm font-extrabold ${featured ? 'text-emerald-400' : 'text-slate-900'}`}>
            {service.startingPrice || '₹499'}
          </span>
        </div>

        <span className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${
          featured
            ? 'bg-blue-600 text-white group-hover:bg-blue-500 shadow-sm'
            : 'bg-slate-100 text-slate-700 group-hover:bg-blue-600 group-hover:text-white'
        }`}>
          Explore →
        </span>
      </div>
    </motion.div>
  );
}
