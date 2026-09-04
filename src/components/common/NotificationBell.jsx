import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  getNotifications, 
  markNotificationRead, 
  markAllNotificationsRead 
} from '../../services/notificationService';
import { getRequestRoutePath } from '../../utils/routeUtils';

export default function NotificationBell({ className = '' }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const fetchNotifs = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await getNotifications();
      setNotifications(res.data || []);
      setUnreadCount(res.unreadCount || 0);
    } catch (err) {
      console.warn('Notifications fetch fallback:', err.message);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, [isAuthenticated]);

  const handleNotifClick = async (notif) => {
    try {
      if (!notif.isRead) {
        await markNotificationRead(notif._id);
        fetchNotifs();
      }
      setDropdownOpen(false);

      if (notif.relatedRequestId) {
        const reqId = notif.relatedRequestId._id || notif.relatedRequestId;
        const targetRole = user?.role === 'technician' ? 'technician' : 'customer';
        navigate(getRequestRoutePath(targetRole, reqId));
      } else if (notif.type === 'REVIEW_RECEIVED') {
        navigate('/technician/dashboard');
      }
    } catch (err) {
      console.warn('Error handling notification click:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      fetchNotifs();
    } catch (err) {
      console.warn('Error marking all read:', err);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className={`relative ${className}`}>
      {/* Bell Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200 relative flex items-center justify-center shadow-xs"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
            {unreadCount}
          </span>
        )}
      </motion.button>

      {/* Notification Dropdown Panel */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2 z-50 overflow-hidden text-xs"
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <span className="font-extrabold text-slate-900 flex items-center">
                <Bell className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                Notifications ({unreadCount} Unread)
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-bold text-blue-600 hover:underline flex items-center"
                >
                  <CheckCheck className="w-3.5 h-3.5 mr-1" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-slate-400 font-medium">
                  You're all caught up! No notifications.
                </div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n._id}
                    onClick={() => handleNotifClick(n)}
                    className={`w-full p-3.5 text-left transition-colors flex items-start space-x-3 hover:bg-slate-50 ${
                      !n.isRead ? 'bg-blue-50/50 font-semibold' : 'opacity-85'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.isRead ? 'bg-blue-600 animate-ping' : 'bg-slate-300'}`}></div>
                    <div className="flex-1 space-y-0.5 min-w-0">
                      <span className="font-bold text-slate-900 block truncate">{n.title}</span>
                      <p className="text-slate-600 font-normal line-clamp-2 text-[11px] leading-relaxed">{n.message}</p>
                      <span className="text-[10px] text-slate-400 font-medium flex items-center pt-0.5">
                        <Clock className="w-3 h-3 mr-1" /> {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
