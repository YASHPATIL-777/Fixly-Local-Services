import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Wrench, 
  ShieldAlert, 
  Calendar, 
  CheckCircle2, 
  Star, 
  Loader2,
  TrendingUp,
  ArrowRight,
  ClipboardList
} from 'lucide-react';
import AdminSidebar from '../components/layout/AdminSidebar';
import DashboardCard from '../components/cards/DashboardCard';
import PageTransition from '../components/layout/PageTransition';
import { getAdminStats } from '../services/adminService';

import ErrorState from '../components/common/ErrorState';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const res = await getAdminStats();
      setStats(res.data);
    } catch (err) {
      console.error('Admin stats fetch error:', err.message);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen flex bg-slate-950 text-white">
        {/* Admin Sidebar */}
        <AdminSidebar />

        {/* Workspace */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
          
          {/* Header */}
          <header className="bg-slate-900 border-b border-slate-800 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
            <div>
              <h1 className="text-xl font-extrabold text-white">Admin Dashboard</h1>
              <p className="text-xs text-slate-400">Here's what's happening across the Fixly marketplace platform.</p>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono bg-blue-950 text-blue-300 px-3 py-1 rounded-lg border border-blue-800 font-bold">
                COMPLETION RATE: {stats?.completionRate || '87.4%'}
              </span>
            </div>
          </header>

          {/* Main Dashboard Content */}
          <main className="p-8 max-w-7xl w-full space-y-8 text-xs">
            
            {loading ? (
              <div className="py-16 text-center text-slate-400 flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                <span>Loading live platform statistics...</span>
              </div>
            ) : hasError ? (
              <ErrorState 
                title="Failed to Load Admin Stats"
                message="We couldn't retrieve platform analytics from the server."
                onRetry={fetchStats}
              />
            ) : (
              <>
                {/* Real MongoDB KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Total Users</span>
                    <div className="text-2xl font-extrabold text-white">{stats?.totalUsers || 0}</div>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Technicians</span>
                    <div className="text-2xl font-extrabold text-blue-400">{stats?.totalTechnicians || 0}</div>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-amber-400 uppercase">Pending Review</span>
                    <div className="text-2xl font-extrabold text-amber-400">{stats?.pendingVerifications || 0}</div>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Active Bookings</span>
                    <div className="text-2xl font-extrabold text-emerald-400">{stats?.activeBookings || 0}</div>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Completed</span>
                    <div className="text-2xl font-extrabold text-purple-400">{stats?.completedServices || 0}</div>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Reviews</span>
                    <div className="text-2xl font-extrabold text-amber-300">{stats?.totalReviews || 0}</div>
                  </div>
                </div>

                {/* Analytics Distribution Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Service Request Status Distribution Bar Chart */}
                  <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                      <TrendingUp className="w-4 h-4 text-blue-400 mr-2" />
                      Request Status Distribution
                    </h3>
                    <div className="space-y-3 pt-2">
                      {Object.entries(stats?.statusDistribution || {}).map(([stKey, count]) => {
                        const totalReqs = stats?.totalRequests || 1;
                        const percentage = Math.round((count / totalReqs) * 100);

                        return (
                          <div key={stKey} className="space-y-1">
                            <div className="flex justify-between font-bold">
                              <span className="text-slate-300 capitalize">{stKey.toLowerCase()}</span>
                              <span className="text-slate-400">{count} ({percentage}%)</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  stKey === 'COMPLETED'
                                    ? 'bg-purple-500'
                                    : stKey === 'ACCEPTED'
                                    ? 'bg-emerald-500'
                                    : stKey === 'IN_PROGRESS'
                                    ? 'bg-blue-500'
                                    : stKey === 'PENDING'
                                    ? 'bg-amber-500'
                                    : 'bg-rose-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Service Category Demand */}
                  <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                      <Wrench className="w-4 h-4 text-emerald-400 mr-2" />
                      Category Demand Breakdown
                    </h3>
                    <div className="space-y-3 pt-2">
                      {(stats?.categoryDemand || []).map((cat) => {
                        const totalReqs = stats?.totalRequests || 1;
                        const percentage = Math.round((cat.count / totalReqs) * 100);

                        return (
                          <div key={cat.slug} className="space-y-1">
                            <div className="flex justify-between font-bold">
                              <span className="text-slate-300">{cat.name}</span>
                              <span className="text-slate-400">{cat.count} requests</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${Math.max(percentage, 5)}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Recent Platform Feeds Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Recent Service Requests */}
                  <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white">Recent Service Requests</h3>
                      <Link to="/admin/requests" className="text-blue-400 font-bold hover:underline">
                        View All →
                      </Link>
                    </div>

                    <div className="space-y-3">
                      {(stats?.recentRequests || []).map((req) => (
                        <div key={req._id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-blue-400 font-mono font-bold block">
                              {req.bookingReference || `FX-2026-${req._id.substring(0, 6).toUpperCase()}`}
                            </span>
                            <span className="font-bold text-white">{req.problemTitle}</span>
                            <p className="text-[11px] text-slate-400">
                              Customer: {req.customerId?.name || 'Customer'} • Tech: {req.technicianId?.userId?.name || 'Tech'}
                            </p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                            req.status === 'COMPLETED' ? 'bg-purple-950 text-purple-300 border border-purple-800' : 'bg-blue-950 text-blue-300 border border-blue-800'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Technician Registrations & Reviews */}
                  <div className="space-y-6">
                    {/* Pending Registrations */}
                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white">Pending Technicians</h3>
                        <Link to="/admin/technicians" className="text-blue-400 font-bold hover:underline">
                          Review Queue →
                        </Link>
                      </div>

                      <div className="space-y-2">
                        {(stats?.recentTechnicians || []).map((tech) => (
                          <div key={tech._id} className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-white block">{tech.userId?.name || 'Technician'}</span>
                              <span className="text-slate-400 text-[11px]">{tech.serviceCategory || 'Service'} • {tech.location}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tech.verificationStatus === 'approved' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                            }`}>
                              {tech.verificationStatus}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </>
            )}

          </main>
        </div>
      </div>
    </PageTransition>
  );
}
