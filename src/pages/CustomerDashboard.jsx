import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  Zap, 
  Wind, 
  Hammer, 
  Sparkles, 
  Tv, 
  Paintbrush, 
  Grid, 
  Car,
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  MapPin,
  Loader2,
  PlayCircle,
  MessageSquare
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import DashboardCard from '../components/cards/DashboardCard';
import PageTransition from '../components/layout/PageTransition';
import TechnicianCard from '../components/cards/TechnicianCard';
import { useAuth } from '../context/AuthContext';
import { getTechnicians } from '../services/technicianService';
import { getMyCustomerRequests } from '../services/requestService';
import { getServiceRoutePath } from '../utils/routeUtils';
import NotificationBell from '../components/common/NotificationBell';
import ErrorState from '../components/common/ErrorState';

const quickCategories = [
  { name: 'Plumbing', slug: 'plumbing', icon: Wrench, color: 'text-blue-600 bg-blue-50' },
  { name: 'Electrical', slug: 'electrical', icon: Zap, color: 'text-amber-600 bg-amber-50' },
  { name: 'Cleaning', slug: 'cleaning', icon: Sparkles, color: 'text-emerald-600 bg-emerald-50' },
  { name: 'AC Repair', slug: 'ac-repair', icon: Wind, color: 'text-cyan-600 bg-cyan-50' },
  { name: 'Carpentry', slug: 'carpentry', icon: Hammer, color: 'text-orange-600 bg-orange-50' },
  { name: 'Appliance Repair', slug: 'appliance-repair', icon: Tv, color: 'text-purple-600 bg-purple-50' },
  { name: 'Vehicle Service', slug: 'vehicle-service', icon: Car, color: 'text-red-600 bg-red-50' },
  { name: 'Home Maintenance', slug: 'home-maintenance', icon: Grid, color: 'text-slate-600 bg-slate-100' },
];

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();
  const [recommendedPros, setRecommendedPros] = useState([]);
  const [customerRequests, setCustomerRequests] = useState([]);
  const [loadingPros, setLoadingPros] = useState(true);
  const [hasError, setHasError] = useState(false);

  const displayName = user?.name || 'Customer';
  const displayInitials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const fetchData = async () => {
    setLoadingPros(true);
    setHasError(false);
    try {
      const [techRes, reqRes] = await Promise.all([
        getTechnicians({ limit: 3, sort: 'rating' }),
        getMyCustomerRequests()
      ]);
      setRecommendedPros(techRes.data || []);
      setCustomerRequests(reqRes.data || []);
    } catch (err) {
      console.error('Error loading customer dashboard data:', err.message);
      setHasError(true);
    } finally {
      setLoadingPros(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const upcomingBooking = customerRequests.find(r => r.status === 'ACCEPTED' || r.status === 'IN_PROGRESS');
  const pendingRequestsCount = customerRequests.filter(r => r.status === 'PENDING').length;
  const activeBookingsCount = customerRequests.filter(r => r.status === 'ACCEPTED' || r.status === 'IN_PROGRESS').length;
  const completedServicesCount = customerRequests.filter(r => r.status === 'COMPLETED').length;

  return (
    <PageTransition>
      <div className="min-h-screen flex bg-slate-50">
        {/* Sidebar Navigation */}
        <Sidebar role="customer" activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dashboard Workspace */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Header */}
          <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-xs">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">Good Evening, {displayName} 👋</h1>
              <p className="text-xs text-slate-500">Welcome to your Fixly service portal</p>
            </div>

            <div className="flex items-center space-x-3">
              <Link to="/services" className="px-3.5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-xs">
                + Request Service
              </Link>
              <NotificationBell />
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                {displayInitials}
              </div>
            </div>
          </header>

          {/* Content View */}
          <main className="p-6 max-w-7xl w-full space-y-8">
            {hasError ? (
              <ErrorState 
                title="Something went wrong"
                message="We couldn't load your dashboard information from the server."
                onRetry={fetchData}
              />
            ) : (
              <>
            {/* Upcoming / Active Booking Alert Banner */}
            {upcomingBooking && (
              <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-2xl p-6 shadow-xl border border-blue-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 text-[10px] uppercase font-extrabold rounded-full ${
                      upcomingBooking.status === 'IN_PROGRESS' ? 'bg-blue-600 text-white animate-pulse' : 'bg-emerald-500 text-white'
                    }`}>
                      {upcomingBooking.status === 'IN_PROGRESS' ? '🔵 Service In Progress' : '🟢 Confirmed Booking'}
                    </span>
                    <span className="text-xs font-mono text-blue-300 font-bold">
                      {upcomingBooking.bookingReference || `FX-2026-${upcomingBooking._id.substring(0, 6).toUpperCase()}`}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white">
                    {upcomingBooking.serviceId?.name || 'Service'}: {upcomingBooking.problemTitle}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Professional: <strong>{upcomingBooking.technicianId?.userId?.name || 'Assigned Technician'}</strong> • Scheduled: {new Date(upcomingBooking.serviceDate).toLocaleDateString()} at {upcomingBooking.serviceTime}
                  </p>
                </div>

                <Link
                  to={`/customer/requests/${upcomingBooking._id}`}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors shrink-0"
                >
                  View Booking Progress →
                </Link>
              </div>
            )}

            {/* Quick Service Selection Widget */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-slate-900">What service do you need today?</h2>
                <Link to="/services" className="text-xs font-bold text-blue-600 hover:underline">
                  Browse All Categories →
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {quickCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.slug}
                      to={getServiceRoutePath(cat.slug)}
                      className="p-3 bg-slate-50 hover:bg-white rounded-xl border border-slate-200/80 hover:border-blue-500/50 hover:shadow-md transition-all text-center flex flex-col items-center justify-center space-y-2 group"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate w-full">
                        {cat.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Metric Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
              <DashboardCard title="Active Bookings" value={activeBookingsCount} icon={Calendar} color="blue" />
              <DashboardCard title="Pending Requests" value={pendingRequestsCount} icon={Clock} color="amber" />
              <DashboardCard title="Completed Services" value={completedServicesCount} icon={CheckCircle2} color="emerald" />
              <Link to="/messages" className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Messages</span>
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600">Open Live Chat</span>
                  <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>

            {/* Recommended Verified Professionals Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Recommended Professionals Near You</h3>
                  <p className="text-xs text-slate-500">Only showing verified & approved Fixly professionals</p>
                </div>
                <Link to="/technicians" className="text-xs font-bold text-blue-600 hover:underline flex items-center">
                  View All Marketplace <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>

              {loadingPros ? (
                <div className="flex items-center justify-center py-8 text-slate-400 text-xs">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin mr-2" /> Loading top professionals...
                </div>
              ) : recommendedPros.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendedPros.map((pro) => (
                    <TechnicianCard key={pro._id || pro.id} technician={pro} />
                  ))}
                </div>
              ) : null}
            </div>
            </>
          )}

          </main>
        </div>
      </div>
    </PageTransition>
  );
}
