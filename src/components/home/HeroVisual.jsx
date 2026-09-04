import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Check, Zap } from 'lucide-react';

export default function HeroVisual() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Only enable mouse parallax on desktop / fine pointers
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 24; // max 12px shift
      const y = (e.clientY / innerHeight - 0.5) * 24;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full max-w-lg h-[440px] sm:h-[480px] flex items-center justify-center select-none">
      
      {/* Background Soft Lavender/Blue Depth Glow */}
      <motion.div
        animate={{
          x: mousePosition.x * 0.3,
          y: mousePosition.y * 0.3
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="absolute inset-0 bg-gradient-to-tr from-blue-500/15 via-indigo-500/10 to-amber-500/5 rounded-[40px] blur-2xl transform rotate-3 scale-95 pointer-events-none"
      />

      {/* Subtle Connection Grid / Faint Ambient Ring */}
      <div className="absolute w-[360px] h-[360px] rounded-full border border-blue-500/10 pointer-events-none animate-pulse-glow" />

      {/* CARD 1 — MAIN PROFESSIONAL CARD (Primary Visual Element) */}
      <motion.div
        animate={{
          x: mousePosition.x * 0.6,
          y: [mousePosition.y * 0.6, mousePosition.y * 0.6 - 8, mousePosition.y * 0.6]
        }}
        transition={{
          y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
          x: { duration: 0.25, ease: 'easeOut' }
        }}
        className="absolute top-4 left-2 right-2 sm:left-4 sm:right-4 bg-white/95 backdrop-blur-md p-6 rounded-[28px] border border-slate-200/90 shadow-[0_20px_50px_rgba(37,99,235,0.12)] space-y-4 z-20"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <img 
              src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=150" 
              alt="Rahul Kumar"
              className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
            />
            <div>
              <h4 className="text-base font-extrabold text-slate-900 tracking-tight">Rahul Kumar</h4>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                Plumbing Specialist
              </span>
            </div>
          </div>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 shrink-0">
            🟢 Available Now
          </span>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
          <div className="flex items-center text-amber-500 font-bold">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1.5" />
            <span>4.9 <span className="text-slate-400 font-normal">(142 reviews)</span></span>
          </div>

          <div className="flex items-center text-slate-500">
            <MapPin className="w-3.5 h-3.5 mr-1 text-rose-500" />
            <span>2.1 km away</span>
          </div>
        </div>
      </motion.div>

      {/* CARD 2 — COMPLETED JOB (Upper/Right Layered Card - Faster float) */}
      <motion.div
        animate={{
          x: mousePosition.x * 1.2,
          y: [mousePosition.y * 1.2, mousePosition.y * 1.2 - 12, mousePosition.y * 1.2]
        }}
        transition={{
          y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 },
          x: { duration: 0.25, ease: 'easeOut' }
        }}
        className="absolute top-44 -right-2 sm:-right-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xl flex items-center space-x-3.5 z-30 min-w-[210px]"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
          <Check className="w-5 h-5 stroke-[3]" />
        </div>
        <div>
          <span className="text-xs font-extrabold text-slate-900 block">Job Completed</span>
          <span className="text-[10px] text-slate-500 font-medium">Duration: 0h 25m</span>
        </div>
      </motion.div>

      {/* CARD 3 — NEW SERVICE REQUEST (Lower/Left Layered Card - Delayed float) */}
      <motion.div
        animate={{
          x: mousePosition.x * 1.5,
          y: [mousePosition.y * 1.5, mousePosition.y * 1.5 - 6, mousePosition.y * 1.5]
        }}
        transition={{
          y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
          x: { duration: 0.25, ease: 'easeOut' }
        }}
        className="absolute bottom-2 left-0 sm:left-2 bg-[#121624] text-white p-4 rounded-2xl border border-slate-800 shadow-2xl space-y-2.5 z-30 max-w-[270px]"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/80 flex items-center">
            <Zap className="w-3 h-3 mr-1 text-amber-400 fill-amber-400" />
            New Service Request
          </span>
          <span className="text-[10px] text-slate-400">Just now</span>
        </div>

        <p className="text-xs font-extrabold text-white tracking-tight">Kitchen Pipe Leak Fix</p>

        <div className="pt-1.5 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400 font-medium">
          <span>Est. Rate</span>
          <strong className="text-emerald-400 font-extrabold text-xs">₹800 – ₹1,200</strong>
        </div>
      </motion.div>

    </div>
  );
}
