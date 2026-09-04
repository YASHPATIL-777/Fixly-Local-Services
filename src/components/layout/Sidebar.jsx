import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  Calendar, 
  MessageSquare, 
  UserCheck, 
  ClipboardList, 
  CheckCircle2, 
  Star, 
  Wrench, 
  Home,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ role = 'customer', activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const customerItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, link: '/customer/dashboard' },
    { id: 'services', label: 'Find Services', icon: Search, link: '/services' },
    { id: 'requests', label: 'My Requests', icon: ClipboardList, link: '/customer/requests' },
    { id: 'messages', label: 'Messages & Chat', icon: MessageSquare, link: '/messages' },
    { id: 'technicians', label: 'Browse Professionals', icon: UserCheck, link: '/technicians' },
  ];

  const technicianItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, link: '/technician/dashboard' },
    { id: 'requests', label: 'Service Requests', icon: ClipboardList, link: '/technician/requests' },
    { id: 'messages', label: 'Messages & Chat', icon: MessageSquare, link: '/messages' },
    { id: 'profile', label: 'Profile Settings', icon: UserCheck, link: '/technician/dashboard' },
  ];

  const items = role === 'customer' ? customerItems : technicianItems;
  const displayRole = user?.role || role;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col justify-between p-4 border-r border-slate-800 shrink-0">
      <div>
        {/* Brand */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Wrench className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Fix<span className="text-blue-500">ly</span>
            </span>
          </Link>
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
            displayRole === 'customer' ? 'bg-blue-900/60 text-blue-300 border border-blue-700/50' : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
          }`}>
            {displayRole}
          </span>
        </div>

        {/* User Info */}
        {user && (
          <div className="mb-4 px-3 py-2 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Navigation items */}
        <div className="space-y-1">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Main Menu
          </div>
          {items.map((item) => {
            const Icon = item.icon;

            if (item.link) {
              return (
                <Link
                  key={item.id}
                  to={item.link}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab && setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer controls */}
      <div className="pt-6 border-t border-slate-800 space-y-2">
        <Link
          to="/"
          className="flex items-center space-x-3 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Back to Landing Page</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
