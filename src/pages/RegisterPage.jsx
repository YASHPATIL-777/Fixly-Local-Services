import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, User, Briefcase, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PageTransition from '../components/layout/PageTransition';
import { useAuth } from '../context/AuthContext';
import { getServices } from '../services/serviceService';

const defaultCategoryOptions = [
  { slug: 'plumbing', name: 'Plumbing' },
  { slug: 'electrical', name: 'Electrical' },
  { slug: 'cleaning', name: 'Cleaning' },
  { slug: 'ac-repair', name: 'AC Repair' },
  { slug: 'carpentry', name: 'Carpentry' },
  { slug: 'appliance-repair', name: 'Appliance Repair' },
  { slug: 'vehicle-service', name: 'Vehicle Service' },
  { slug: 'home-maintenance', name: 'Home Maintenance' }
];

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'technician' ? 'technician' : 'customer';

  const [role, setRole] = useState(initialRole);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    serviceCategory: 'plumbing',
    experienceYears: '3',
    location: 'Thane'
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('role') === 'technician') {
      setRole('technician');
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Frontend validations
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    setSubmitting(true);

    const payload = {
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: role,
      serviceCategory: formData.serviceCategory,
      experienceYears: Number(formData.experienceYears),
      location: formData.location
    };

    const res = await register(payload);
    setSubmitting(false);

    if (res.success && res.user) {
      if (res.user.role === 'technician') {
        navigate('/technician/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } else {
      setErrorMessage(res.message || 'Registration failed. Please check your details.');
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
            className="max-w-lg w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6"
          >
            
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-600/20">
                <Wrench className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Create your account</h2>
              <p className="text-slate-500 text-xs">
                Join FixNear to book services or serve customers in your neighborhood
              </p>
            </div>

            {/* Error Alert */}
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

            {/* Role Toggle Selector */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition-all ${
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
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  role === 'technician'
                    ? 'bg-white text-emerald-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Technician</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Rahul Patil"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>
              </div>

              {/* Technician Extra Fields with AnimatePresence */}
              <AnimatePresence>
                {role === 'technician' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-4 overflow-hidden"
                  >
                    <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center">
                      <Briefcase className="w-3.5 h-3.5 mr-1.5" /> Technician Professional Profile
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Service Skill</label>
                        <select
                          name="serviceCategory"
                          value={formData.serviceCategory}
                          onChange={handleChange}
                          className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-medium"
                        >
                          {defaultCategoryOptions.map((s) => (
                            <option key={s.slug} value={s.slug}>{s.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Experience</label>
                        <select
                          name="experienceYears"
                          value={formData.experienceYears}
                          onChange={handleChange}
                          className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-medium"
                        >
                          <option value="1">1 Year</option>
                          <option value="2">2 Years</option>
                          <option value="3">3 Years</option>
                          <option value="5">5+ Years</option>
                          <option value="8">8+ Years</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Primary Area</label>
                        <select
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-medium"
                        >
                          <option value="Thane">Thane</option>
                          <option value="Mumbai">Mumbai</option>
                          <option value="Navi Mumbai">Navi Mumbai</option>
                          <option value="Kalyan">Kalyan</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs"
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
                    role === 'technician'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Register as {role === 'technician' ? 'Technician' : 'Customer'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-blue-600 hover:underline">
                Log in
              </Link>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
