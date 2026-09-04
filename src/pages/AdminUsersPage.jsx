import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  UserCheck, 
  UserX,
  X
} from 'lucide-react';
import AdminSidebar from '../components/layout/AdminSidebar';
import PageTransition from '../components/layout/PageTransition';
import { getAdminUsers, updateUserStatus } from '../services/adminService';
import { useAuth } from '../context/AuthContext';

export default function AdminUsersPage() {
  const { user: currentAdmin } = useAuth();
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAdminUsers(roleFilter, searchTerm, page, 10);
      setUsers(res.data.users || []);
      setTotalPages(res.data.pages || 1);
      setTotalUsersCount(res.data.totalUsers || 0);
    } catch (err) {
      setNotification(`Failed to load users: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [roleFilter, searchTerm, page]);

  const handleToggleUserStatus = async (targetUser) => {
    if (actionLoading) return;
    if (targetUser._id.toString() === currentAdmin?._id?.toString()) {
      setNotification('You cannot suspend your own admin account.');
      return;
    }

    const newStatus = targetUser.accountStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    setActionLoading(true);
    try {
      await updateUserStatus(targetUser._id, newStatus);
      setNotification(`User status updated to ${newStatus}`);
      await fetchUsers();
    } catch (err) {
      setNotification(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex bg-slate-950 text-white">
        <AdminSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Header */}
          <header className="bg-slate-900 border-b border-slate-800 px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10">
            <div>
              <h1 className="text-xl font-extrabold text-white">User Account Management</h1>
              <p className="text-xs text-slate-400">Total Registered Users: {totalUsersCount}</p>
            </div>

            <div className="flex items-center space-x-3">
              {/* Search Bar */}
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Role Filters */}
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                {['all', 'customer', 'technician', 'admin'].map((r) => (
                  <button
                    key={r}
                    onClick={() => { setRoleFilter(r); setPage(1); }}
                    className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                      roleFilter === r ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </header>

          {/* Action Notification */}
          <AnimatePresence>
            {notification && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-slate-900 text-white px-6 py-3 border-b border-slate-800 flex items-center justify-between text-xs font-bold"
              >
                <span>{notification}</span>
                <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content */}
          <main className="p-8 max-w-7xl w-full space-y-6 text-xs">
            
            {loading ? (
              <div className="py-16 text-center text-slate-400 flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                <span>Loading platform users...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center text-slate-400">
                No users match the search criteria or filter.
              </div>
            ) : (
              <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase font-extrabold text-[10px]">
                        <th className="p-4">User Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Account Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-xs">
                      {users.map((u) => {
                        const isSuspended = u.accountStatus === 'SUSPENDED';
                        const isSelf = u._id.toString() === currentAdmin?._id?.toString();

                        return (
                          <tr key={u._id} className="hover:bg-slate-850/50 transition-colors">
                            <td className="p-4 font-bold text-white flex items-center space-x-2">
                              <span>{u.name}</span>
                              {isSelf && (
                                <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                                  You (Admin)
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-slate-300">{u.email}</td>
                            <td className="p-4 text-slate-400">{u.phone || 'N/A'}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded text-[10px] font-extrabold uppercase ${
                                u.role === 'admin'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : u.role === 'technician'
                                  ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                  : 'bg-slate-800 text-slate-300'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                isSuspended
                                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              }`}>
                                {isSuspended ? '🔴 SUSPENDED' : '🟢 ACTIVE'}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              {!isSelf && (
                                <button
                                  disabled={actionLoading}
                                  onClick={() => handleToggleUserStatus(u)}
                                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                                    isSuspended
                                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                      : 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800'
                                  }`}
                                >
                                  {isSuspended ? 'Activate User' : 'Suspend User'}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                      className="px-3 py-1.5 bg-slate-900 text-slate-300 hover:bg-slate-800 font-bold rounded-lg disabled:opacity-50"
                    >
                      ← Previous Page
                    </button>
                    <span className="text-slate-400 font-medium">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      disabled={page >= totalPages}
                      onClick={() => setPage(page + 1)}
                      className="px-3 py-1.5 bg-slate-900 text-slate-300 hover:bg-slate-800 font-bold rounded-lg disabled:opacity-50"
                    >
                      Next Page →
                    </button>
                  </div>
                )}
              </div>
            )}

          </main>
        </div>
      </div>
    </PageTransition>
  );
}
