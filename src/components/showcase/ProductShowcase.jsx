import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, MapPin, CheckCircle2, ArrowRight, Wrench, ShieldCheck, Clock } from 'lucide-react';
import { mockProfessionals } from '../../data/mockData';

export default function ProductShowcase() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const displayPros = selectedCategory === 'all'
    ? mockProfessionals.slice(0, 3)
    : mockProfessionals.filter(p => p.serviceCategory === selectedCategory);

  return (
    <section className="py-20 md:py-28 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-3.5 py-1.5 rounded-full border border-blue-800">
            Interactive Product Preview
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            See how Fixly works in action.
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Experience the instant matching interface connecting customers to top-rated local professionals in under 60 seconds.
          </p>
        </div>

        {/* Floating Layered Application UI Preview Screen */}
        <motion.div 
          initial={{ opacity: 0, y: 40, rotateX: 10 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-4xl mx-auto bg-slate-950/90 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-2xl relative"
        >
          {/* Mock App Top Bar */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Good evening 👋</h3>
                <p className="text-xs text-slate-400">What service do you need today?</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2 bg-emerald-950/80 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              <span>100% Background Verified</span>
            </div>
          </div>

          {/* Search & Category Tabs */}
          <div className="space-y-4 mb-8">
            <div className="relative max-w-lg">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                readOnly
                value="Need kitchen pipe leak fix in Thane..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 cursor-default"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar text-xs">
              {['all', 'plumbing', 'electrical', 'cleaning', 'ac-repair'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg font-medium capitalize shrink-0 transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat === 'all' ? 'All Professionals' : cat.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Available Professionals List Showcase */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>AVAILABLE PROFESSIONALS NEARBY</span>
              <span className="text-emerald-400 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" /> Live Matching Active
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {displayPros.map((pro) => (
                <motion.div 
                  key={pro.id}
                  whileHover={{ x: 4, scale: 1.01 }}
                  className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4">
                    <img 
                      src={pro.avatar} 
                      alt={pro.name} 
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-white">{pro.name}</h4>
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-950 text-blue-300 border border-blue-800">
                          {pro.service}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-slate-400">
                        <span className="flex items-center text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" /> {pro.rating}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-3.5 h-3.5 text-rose-400 mr-1" /> {pro.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block uppercase font-medium">Est. Price</span>
                      <span className="text-xs font-bold text-emerald-400">{pro.hourlyRate}</span>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center">
                      Book Now
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Floating UI Decorative Pill */}
          <div className="hidden sm:flex absolute -bottom-5 -right-5 bg-white text-slate-900 px-4 py-2.5 rounded-xl shadow-2xl border border-slate-200 items-center space-x-3 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Instant Confirmation Available</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
