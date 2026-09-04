import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, User, Briefcase, ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PageTransition from '../components/layout/PageTransition';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [role, setRole] = useState('customer'); // customer | technician | admin
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    const res = await login(email, password, role);
    setSubmitting(false);

    if (res.success && res.user) {
      if (res.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (res.user.role === 'technician') {
        navigate('/technician/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } else {
      setErrorMessage(res.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6"
          >
            
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-600/20">
                <Wrench className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Welcome back</h2>
              <p className="text-slate-500 text-xs">
                Log in to manage your bookings, requests, or platform console
              </p>
            </div>

            {/* Error Banner */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center space-x-2"
                >
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 3-Role Toggle Selector (Customer | Technician | Admin) */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg font-bold transition-all ${
                  role === 'customer'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Customer</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('technician')}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg font-bold transition-all ${
                  role === 'technician'
                    ? 'bg-white text-emerald-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Technician</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg font-bold transition-all ${
                  role === 'admin'
                    ? 'bg-white text-purple-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder={
                      role === 'admin' 
                        ? 'admin@fixnear.com' 
                        : role === 'technician' 
                        ? 'tech@fixnear.com' 
                        : 'customer@fixnear.com'
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Password</label>
                  <span className="text-blue-600 hover:underline cursor-pointer">Forgot password?</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={submitting}
                  type="submit"
                  className={`w-full py-3 rounded-xl text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center space-x-2 ${
                    role === 'admin'
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : role === 'technician'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Login as {role === 'admin' ? 'Admin' : role === 'technician' ? 'Technician' : 'Customer'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            {/* Quick Helper Credentials Note for Demo */}
            {role === 'admin' && (
              <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl text-[11px] text-purple-900 space-y-1">
                <p className="font-bold">Default Admin Account:</p>
                <p>Email: <code className="bg-purple-100 px-1 py-0.5 rounded font-mono">admin@fixnear.com</code></p>
                <p>Password: <code className="bg-purple-100 px-1 py-0.5 rounded font-mono">Admin@123456</code></p>
              </div>
            )}

            {/* Footer note */}
            <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
              Don't have an account?{' '}
              <Link to={`/register?role=${role}`} className="font-bold text-blue-600 hover:underline">
                Register here
              </Link>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
