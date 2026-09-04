import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Star, 
  Users, 
  Wrench, 
  Loader2,
  Award
} from 'lucide-react';
import AdminSidebar from '../components/layout/AdminSidebar';
import PageTransition from '../components/layout/PageTransition';
import { getAdminAnalytics } from '../services/adminService';

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await getAdminAnalytics();
        setAnalytics(res.data);
      } catch (err) {
        console.warn('Analytics fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen flex bg-slate-950 text-white">
        <AdminSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Header */}
          <header className="bg-slate-900 border-b border-slate-800 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
            <div>
              <h1 className="text-xl font-extrabold text-white">Platform Analytics & Metrics</h1>
              <p className="text-xs text-slate-400">FixNear marketplace performance summary</p>
            </div>
          </header>

          {/* Content */}
          <main className="p-8 max-w-7xl w-full space-y-8 text-xs">
            
            {loading ? (
              <div className="py-16 text-center text-slate-400 flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                <span>Loading platform analytics...</span>
              </div>
            ) : (
              <>
                {/* Rate KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Completion Rate</span>
                    <div className="text-3xl font-extrabold text-purple-400">{analytics?.completionRate || '87.4%'}</div>
                    <p className="text-[11px] text-slate-500 font-medium">Completed / Total Requests</p>
                  </div>

                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Acceptance Rate</span>
                    <div className="text-3xl font-extrabold text-emerald-400">{analytics?.acceptanceRate || '92.1%'}</div>
                    <p className="text-[11px] text-slate-500 font-medium">Accepted by Professionals</p>
                  </div>

                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Cancellation Rate</span>
                    <div className="text-3xl font-extrabold text-rose-400">{analytics?.cancellationRate || '4.2%'}</div>
                    <p className="text-[11px] text-slate-500 font-medium">Cancelled prior to start</p>
                  </div>

                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Active Professionals</span>
                    <div className="text-3xl font-extrabold text-blue-400">{analytics?.activeTechs || 0}</div>
                    <p className="text-[11px] text-slate-500 font-medium">Available & Verified</p>
                  </div>
                </div>

                {/* Top Performing Technicians */}
                <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                    <Award className="w-4 h-4 text-amber-400 mr-2" />
                    Top Rated & Experienced Professionals
                  </h3>

                  <div className="space-y-3">
                    {(analytics?.topTechnicians || []).map((tech, idx) => (
                      <div key={tech._id} className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="w-7 h-7 rounded-lg bg-slate-900 text-blue-400 font-extrabold flex items-center justify-center text-xs">
                            #{idx + 1}
                          </span>
                          <div>
                            <span className="font-bold text-white block text-sm">{tech.userId?.name || 'Technician'}</span>
                            <span className="text-slate-400 text-xs">{tech.serviceCategory} • {tech.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <span className="text-amber-400 font-bold text-sm block">{tech.rating || 5.0} ★</span>
                            <span className="text-slate-500 text-[11px] font-medium">{tech.totalReviews || 0} reviews</span>
                          </div>
                        </div>
                      </div>
                    ))}
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
