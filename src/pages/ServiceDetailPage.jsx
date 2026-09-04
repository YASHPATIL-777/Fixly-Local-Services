import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench, Zap, Wind, Hammer, Sparkles, Tv, Paintbrush, Grid, Car, ArrowLeft, Search, Filter, Loader2, AlertCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PageTransition from '../components/layout/PageTransition';
import TechnicianCard from '../components/cards/TechnicianCard';
import { getServiceBySlug } from '../services/serviceService';
import { getTechnicians } from '../services/technicianService';

import ErrorState from '../components/common/ErrorState';

const iconMap = { Wrench, Zap, Wind, Hammer, Sparkles, Tv, Paintbrush, Grid, Car };

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');

  const fetchData = async () => {
    if (!slug) return;
    setLoading(true);
    setNotFoundError(false);
    setFetchError(false);

    try {
      const serviceRes = await getServiceBySlug(slug);
      const currentService = serviceRes.data;
      setService(currentService);

      const techRes = await getTechnicians({ service: currentService._id || slug });
      setTechnicians(techRes.data || []);
    } catch (err) {
      console.error('Service detail fetch error:', err.message);
      if (err.message?.includes('404') || err.message?.includes('not found')) {
        setNotFoundError(true);
      } else {
        setFetchError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  // Safe data filtering with property normalization
  const filteredTechs = technicians.filter(t => {
    if (!t) return false;
    const name = String(t.userId?.name || t.name || '').toLowerCase();
    const serviceName = String(
      t.serviceCategory ||
      (t.serviceIds && t.serviceIds.length > 0 ? (t.serviceIds[0].name || t.serviceIds[0]) : '') ||
      t.service ||
      ''
    ).toLowerCase();
    const loc = String(t.location || '').toLowerCase();
    const search = String(searchTerm || '').toLowerCase();

    const matchesSearch = !search || name.includes(search) || serviceName.includes(search);
    const matchesLoc = locationFilter === 'all' || loc.includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLoc;
  });

  const IconComponent = service ? (iconMap[service.icon] || Wrench) : Wrench;

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        {fetchError ? (
          <div className="flex-1 flex items-center justify-center py-20 px-4">
            <ErrorState 
              title="Failed to Load Service Details"
              message="We couldn't load details for this service category from the server."
              onRetry={fetchData}
            />
          </div>
        ) : notFoundError ? (
          <div className="flex-1 flex items-center justify-center py-20 px-4">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl max-w-md w-full text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
              <h2 className="text-xl font-extrabold text-slate-900">Service Category Not Found</h2>
              <p className="text-xs text-slate-500">
                The service category <strong>"{slug}"</strong> could not be located in our directory.
              </p>
              <Link to="/services" className="inline-block px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md">
                Browse All Services
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Hero Banner */}
            <div className="bg-slate-900 text-white py-14 border-b border-slate-800 relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
                <Link to="/services" className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Services Catalog
                </Link>

                {loading ? (
                  <div className="flex items-center space-x-3 py-6">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    <span className="text-sm font-medium text-slate-400">Loading service details...</span>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950 px-3 py-1 rounded-full border border-blue-800">
                          Category
                        </span>
                      </div>
                      <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                        Verified {service?.name || 'Professional'} Services
                      </h1>
                      <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                        {service?.description || `Find trusted ${service?.name || ''} professionals for repairs and maintenance near you.`}
                      </p>
                    </div>

                    <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-1 text-xs shrink-0">
                      <span className="text-slate-400 font-medium block">Verified Professionals</span>
                      <div className="text-2xl font-extrabold text-emerald-400">{filteredTechs.length} Available</div>
                      <p className="text-slate-400 text-[11px]">Instant request matching active</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border-b border-slate-200 sticky top-16 sm:top-20 z-30 shadow-xs">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder={`Search ${service?.name || ''} professionals...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center space-x-3 text-xs w-full sm:w-auto">
                    <span className="font-bold text-slate-600">Location:</span>
                    <select
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
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

            {/* Professionals Grid */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">
                  Available {service?.name || ''} Experts ({filteredTechs.length})
                </h2>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-4">
                      <div className="h-16 bg-slate-200 rounded-xl"></div>
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : filteredTechs.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
                  <Filter className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">No {service?.name || ''} professionals found in this area</h3>
                  <p className="text-slate-500 text-xs">Try selecting 'All Locations' or clearing your search query.</p>
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
                  {filteredTechs.map((tech) => (
                    <motion.div
                      key={tech._id || tech.id}
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        visible: { opacity: 1, y: 0 }
                      }}
                    >
                      <TechnicianCard technician={tech} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </main>
          </>
        )}

        <Footer />
      </div>
    </PageTransition>
  );
}
