import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ArrowRight, 
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../common/NotificationBell';

// Custom Stylized Fixly Geometric SVG Logo Icon
export const FixlyLogoIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="10" fill="#2563EB" />
    <path d="M10 10H22M10 16H18M10 22H22" stroke="white" strokeWidth="3" strokeLinecap="round" />
    <circle cx="22" cy="16" r="3" fill="#60A5FA" />
  </svg>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavScrollClick = (id) => {
    if (location.pathname === '/') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${id}`);
    }
  };

  const navLinks = [
    { path: '/services', label: 'Services' },
    { path: '#how-it-works', label: 'How It Works', isAnchor: true, id: 'how-it-works' },
    { path: '/technicians', label: 'For Professionals' },
    { path: '#about', label: 'About', isAnchor: true, id: 'about' },
  ];

  const dashboardPath = user?.role === 'technician' 
    ? '/technician/dashboard' 
    : user?.role === 'admin' 
    ? '/admin/dashboard' 
    : '/customer/dashboard';

  return (
    <div className="sticky top-0 z-50 pt-3 px-4 sm:px-6 lg:px-8 pointer-events-none">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`pointer-events-auto max-w-6xl mx-auto rounded-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-md py-3 px-6 sm:px-8'
            : 'bg-white/75 backdrop-blur-sm border border-slate-200/60 shadow-xs py-3.5 px-6 sm:px-8'
        }`}
      >
        <div className="flex items-center justify-between">
          
          {/* Refined Fixly Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -3 }}
              whileTap={{ scale: 0.95 }}
              className="shrink-0"
            >
              <FixlyLogoIcon className="w-8 h-8" />
            </motion.div>
            <div className="flex items-center">
              <span className="text-[24px] font-extrabold text-slate-900 tracking-[-0.04em] leading-none">
                Fix<span className="text-blue-600">ly</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 sm:space-x-7 lg:space-x-8">
            <Link
              to="/"
              className={`text-[15px] tracking-[-0.01em] transition-colors duration-150 ${
                isActive('/') 
                  ? 'text-blue-600 font-semibold' 
                  : 'text-slate-800 font-medium hover:text-blue-600'
              }`}
            >
              Home
            </Link>

            {navLinks.map((link) => {
              if (link.isAnchor) {
                return (
                  <button
                    key={link.label}
                    onClick={() => handleNavScrollClick(link.id)}
                    className="text-[15px] font-medium tracking-[-0.01em] text-slate-800 hover:text-blue-600 transition-colors duration-150 cursor-pointer"
                  >
                    {link.label}
                  </button>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-[15px] tracking-[-0.01em] transition-colors duration-150 ${
                    isActive(link.path) 
                      ? 'text-blue-600 font-semibold' 
                      : 'text-slate-800 font-medium hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3 sm:space-x-3.5">
            {isAuthenticated && (
              <>
                <Link
                  to="/messages"
                  className="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100/70 rounded-full transition-colors duration-150 relative"
                  title="Messages & Chat"
                >
                  <MessageSquare className="w-5 h-5 stroke-[1.8]" />
                </Link>
                <NotificationBell />
              </>
            )}

            {isAuthenticated && user ? (
              <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to={dashboardPath}
                  className="text-[14px] font-semibold text-slate-900 tracking-[-0.01em] bg-slate-50/90 hover:bg-slate-100 px-4.5 py-2 rounded-full border border-slate-200/90 shadow-2xs transition-all duration-150 inline-flex items-center space-x-1"
                >
                  <span>Dashboard</span>
                </Link>
              </motion.div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-[15px] font-medium text-slate-800 hover:text-blue-600 tracking-[-0.01em] px-3 py-1.5 transition-colors duration-150"
                >
                  Login
                </Link>
                <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/register"
                    className="inline-flex items-center text-[14px] font-semibold tracking-[-0.01em] px-4.5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-xs transition-colors duration-150"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && <NotificationBell />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-full text-slate-800 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-100 mt-3 pt-3 pb-2 space-y-2 overflow-hidden text-[14px] font-medium text-slate-800"
            >
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 hover:text-blue-600">
                Home
              </Link>
              <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 hover:text-blue-600">
                Services
              </Link>
              <Link to="/technicians" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 hover:text-blue-600">
                For Professionals
              </Link>
              {isAuthenticated ? (
                <Link to={dashboardPath} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-blue-600 font-semibold">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 hover:text-blue-600">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-blue-600 font-semibold">
                    Get Started
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </motion.header>
    </div>
  );
}
