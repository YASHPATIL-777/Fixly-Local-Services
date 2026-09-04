import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Wrench, Loader2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PageTransition from '../components/layout/PageTransition';
import ServiceCard from '../components/cards/ServiceCard';
import { getServices } from '../services/serviceService';

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await getServices();
        setServices(res.data || []);
      } catch (err) {
        console.error('Failed to fetch services from API:', err.message);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter(service => {
    if (!service) return false;
    const name = String(service.name || '').toLowerCase();
    const desc = String(service.description || '').toLowerCase();
    const search = String(searchTerm || '').toLowerCase();

    return !search || name.includes(search) || desc.includes(search);
  });

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-[#F7F6F2] text-[#121316]">
        <Navbar />

        {/* Header Banner */}
        <div className="pt-12 pb-16 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200/80">
              Fixly Marketplace Directory
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Whatever you need, <span className="text-blue-600">we've got someone for it.</span>
            </h1>
            <p className="text-slate-600 text-sm max-w-xl mx-auto font-normal">
              Find certified professionals for all home maintenance, repair, and installation requirements.
            </p>

            {/* Search Box */}
            <div className="max-w-xl mx-auto pt-4">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search for plumbing, AC repair, electrician, cleaning..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid Section */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-extrabold text-slate-900">
              Available Service Categories ({filteredServices.length})
            </h2>
          </div>

          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <span>Loading service categories...</span>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3 shadow-xs">
              <Wrench className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No matching services found</h3>
              <p className="text-slate-500 text-xs">Try searching for terms like "plumbing", "AC", "vehicle", or "cleaning".</p>
            </div>
          ) : (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredServices.map(service => (
                <motion.div 
                  key={service._id || service.id}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <ServiceCard service={service} />
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
