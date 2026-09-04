import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Star, 
  BarChart3, 
  LogOut, 
  ArrowLeft, 
  ShieldAlert 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/technicians', label: 'Technicians', icon: Wrench },
  { path: '/admin/requests', label: 'Service Requests', icon: ClipboardList },
  { path: '/admin/reviews', label: 'Reviews', icon: Star },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 }
];

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0 shrink-0 border-r border-slate-800 shadow-xl z-20">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800">
        <Link to="/admin/dashboard" className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <Wrench className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-lg font-extrabold text-white tracking-tight flex items-center">
              Fix<span className="text-blue-500">ly</span>
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
              ADMIN PANEL
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto text-xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Controls */}
      <div className="p-4 border-t border-slate-800 space-y-2 text-xs">
        <Link
          to="/"
          className="flex items-center space-x-2 text-slate-400 hover:text-white px-3 py-2 rounded-lg font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-3 py-2 rounded-lg font-bold transition-colors text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Admin</span>
        </button>
      </div>
    </aside>
  );
}
