import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Filter, X, CheckCircle2, Loader2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PageTransition from '../components/layout/PageTransition';
import TechnicianCard from '../components/cards/TechnicianCard';
import { getTechnicians } from '../services/technicianService';

import ErrorState from '../components/common/ErrorState';

export default function TechniciansPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTechs = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const query = {};
      if (selectedCategory !== 'all') query.service = selectedCategory;
      if (selectedLocation !== 'all') query.location = selectedLocation;
      if (searchTerm) query.search = searchTerm;

      const res = await getTechnicians(query);
      setTechnicians(res.data || []);
    } catch (err) {
      console.error('Technicians page fetch error:', err.message);
      setHasError(true);
      setTechnicians([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechs();
  }, [selectedCategory, selectedLocation, searchTerm]);

  // Safe data filtering with property normalization
  const filteredProfessionals = technicians.filter((pro) => {
    if (!pro) return false;
    const name = String(pro.userId?.name || pro.name || '').toLowerCase();
    const service = String(
      pro.serviceCategory ||
      (pro.serviceIds && pro.serviceIds.length > 0 ? (pro.serviceIds[0].name || pro.serviceIds[0]) : '') ||
      pro.service ||
      ''
    ).toLowerCase();
    const loc = String(pro.location || '').toLowerCase();
    const search = String(searchTerm || '').toLowerCase();

    const matchesCategory = selectedCategory === 'all' || service.includes(selectedCategory.toLowerCase());
    const matchesLocation = selectedLocation === 'all' || loc.includes(selectedLocation.toLowerCase());
    const matchesSearch = !search || name.includes(search) || service.includes(search) || loc.includes(search);
    return matchesCategory && matchesLocation && matchesSearch;
  });

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        {/* Header Banner */}
        <div className="bg-slate-900 text-white py-14 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-3.5 py-1.5 rounded-full border border-emerald-800">
              Verified Professionals
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Find Verified Local Professionals
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
              Compare ratings, reviews, distance and book verified service providers near you.
            </p>

            {/* Search bar */}
            <div className="max-w-xl mx-auto pt-4">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search professional by name, skill or area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-inner"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white border-b border-slate-200 sticky top-16 sm:top-20 z-30 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-700">
              
              {/* Category Filter Pills */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-lg shrink-0 transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Categories
                </button>
                {['plumbing', 'electrical', 'cleaning', 'ac-repair', 'carpentry', 'appliance-repair', 'vehicle-service', 'home-maintenance'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg shrink-0 capitalize transition-colors ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.replace(/-/g, ' ')}
                  </button>
                ))}
              </div>

              {/* Location Select */}
              <div className="flex items-center space-x-2 shrink-0">
                <MapPin className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
                >
                  <option value="all">All Locations</option>
                  <option value="thane">Thane</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="mulund">Mulund</option>
                  <option value="kalyan">Kalyan</option>
                </select>
              </div>

            </div>
          </div>
        </div>

        {/* Directory Grid */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Verified Professionals ({filteredProfessionals.length})
            </h2>
          </div>

          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <span>Loading verified marketplace professionals...</span>
            </div>
          ) : hasError ? (
            <ErrorState 
              title="Failed to load professionals"
              message="We couldn't reach the Fixly server to load professionals. Please check your connection and try again."
              onRetry={fetchTechs}
            />
          ) : filteredProfessionals.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 max-w-md mx-auto my-8 shadow-xs">
              <Filter className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">No Professionals Found</h3>
              <p className="text-xs text-slate-500">No registered professionals matched your current filter criteria.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedLocation('all');
                  setSearchTerm('');
                }}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProfessionals.map((pro) => (
                <motion.div
                  key={pro._id || pro.id}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <TechnicianCard technician={pro} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
