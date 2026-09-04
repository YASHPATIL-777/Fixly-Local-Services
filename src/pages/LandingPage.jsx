import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  Wrench, 
  Zap, 
  Wind, 
  Hammer, 
  Sparkles, 
  Tv, 
  Grid, 
  Car, 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Award,
  ChevronRight,
  TrendingUp,
  Phone,
  PlayCircle
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PageTransition from '../components/layout/PageTransition';
import ServiceCard from '../components/cards/ServiceCard';
import HeroVisual from '../components/home/HeroVisual';
import AnimatedCountUp from '../components/common/AnimatedCountUp';
import { mockServices } from '../data/mockData';
import { getTechnicians } from '../services/technicianService';

export default function LandingPage() {
  const [topTechnicians, setTopTechnicians] = useState([]);
  const [loadingTechs, setLoadingTechs] = useState(true);

  // Top Scroll Progress Line Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 40 });

  useEffect(() => {
    const fetchTopTechs = async () => {
      setLoadingTechs(true);
      try {
        const res = await getTechnicians({ limit: 3, sort: 'rating' });
        setTopTechnicians(res.data || []);
      } catch (err) {
        console.warn('Landing page tech fetch fallback:', err.message);
      } finally {
        setLoadingTechs(false);
      }
    };
    fetchTopTechs();
  }, []);

  // Services List
  const plumbing = mockServices.find(s => s.slug === 'plumbing') || mockServices[0];
  const electrical = mockServices.find(s => s.slug === 'electrical') || mockServices[1];
  const cleaning = mockServices.find(s => s.slug === 'cleaning') || mockServices[2];
  const acRepair = mockServices.find(s => s.slug === 'ac-repair') || mockServices[3];
  const carpentry = mockServices.find(s => s.slug === 'carpentry') || mockServices[4];
  const appliance = mockServices.find(s => s.slug === 'appliance-repair') || mockServices[5];
  const vehicle = mockServices.find(s => s.slug === 'vehicle-service') || mockServices[6];
  const homeMaint = mockServices.find(s => s.slug === 'home-maintenance') || mockServices[7];

  const allEightServices = [
    { ...plumbing, isFeatured: true },
    electrical,
    cleaning,
    acRepair,
    carpentry,
    appliance,
    vehicle,
    homeMaint
  ];

  // Distinct Directional Choreography for Services Section Cards
  const getServiceMotionProps = (index) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

    // Custom initial positions per card
    const configs = [
      { initial: { opacity: 0, y: isMobile ? -40 : -100, rotate: -4, scale: 0.96 }, delay: 0.00 }, // Plumbing
      { initial: { opacity: 0, y: isMobile ? -40 : -140, rotate: 3, scale: 0.96 }, delay: 0.08 },  // Electrical
      { initial: { opacity: 0, x: isMobile ? 30 : 100, rotate: 4, scale: 0.96 }, delay: 0.16 },   // Cleaning
      { initial: { opacity: 0, y: isMobile ? -40 : -100, rotate: -3, scale: 0.96 }, delay: 0.24 }, // AC Repair
      { initial: { opacity: 0, x: isMobile ? -30 : -100, rotate: -3, scale: 0.96 }, delay: 0.32 },// Carpentry
      { initial: { opacity: 0, y: isMobile ? 40 : 100, rotate: 2, scale: 0.96 }, delay: 0.40 },   // Appliance Repair
      { initial: { opacity: 0, x: isMobile ? 30 : 100, rotate: 3, scale: 0.96 }, delay: 0.48 },   // Vehicle Service
      { initial: { opacity: 0, y: isMobile ? 40 : 120, rotate: -2, scale: 0.96 }, delay: 0.56 }   // Home Maintenance
    ];

    const config = configs[index] || { initial: { opacity: 0, y: 50 }, delay: 0.1 };

    return {
      initial: config.initial,
      whileInView: { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 },
      viewport: { once: true, amount: 0.15 },
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: config.delay
      }
    };
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#121316] selection:bg-blue-600 selection:text-white">
        
        {/* Top Scroll Progress Indicator */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-50 origin-left"
          style={{ scaleX }}
        />

        <Navbar />

        {/* HERO SECTION */}
        <section className="relative pt-36 sm:pt-40 lg:pt-44 pb-20 lg:pb-28 overflow-hidden">
          
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Hero Left Column */}
              <div className="lg:col-span-6 space-y-6 text-left">
                
                {/* Eyebrow Pill */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200/80 px-3.5 py-1.5 rounded-full"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700">
                    Local Services, Reimagined
                  </span>
                </motion.div>

                {/* Massive 2-Line Hero Heading */}
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.08] text-slate-900"
                >
                  Get the right professional. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    Get the job done.
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-lg"
                >
                  Book trusted local professionals for repairs, maintenance and everyday services — without the usual hassle.
                </motion.p>

                {/* Primary CTA Buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2"
                >
                  <Link
                    to="/technicians"
                    className="px-7 py-3.5 rounded-full bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-sm shadow-lg hover:shadow-xl transition-all duration-200 text-center flex items-center justify-center space-x-2"
                  >
                    <span>Find a Professional</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/register?role=technician"
                    className="px-7 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm border border-slate-300 shadow-xs transition-colors text-center"
                  >
                    Become a Professional
                  </Link>
                </motion.div>

                {/* Mini Trust Badges */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="pt-6 border-t border-slate-200/80 flex items-center space-x-6 text-xs text-slate-500 font-medium"
                >
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verified Pros</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>4.8/5 Avg Rating</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Instant Booking</span>
                  </div>
                </motion.div>

              </div>

              {/* Hero Right Column — 3 Layered Floating UI Cards Composition */}
              <div className="lg:col-span-6 relative flex items-center justify-center">
                <HeroVisual />
              </div>

            </div>
          </div>
        </section>

        {/* SERVICES SECTION — Physical Card Drop & Fly-In Choreography */}
        <section id="services" className="pt-28 pb-24 bg-white border-y border-slate-200/80 scroll-mt-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            {/* Section Header Sequence */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4 }}
                  className="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block"
                >
                  SERVICES
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: 0.08 }}
                  className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
                >
                  Whatever you need, <br />
                  <span className="text-slate-500 font-bold">we've got someone for it.</span>
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: 0.16 }}
                  className="text-xs sm:text-sm text-slate-500 font-normal"
                >
                  Find trusted professionals for repairs, maintenance and everyday services.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Link to="/services" className="text-xs font-bold text-blue-600 hover:underline flex items-center shrink-0">
                  Browse All Services →
                </Link>
              </motion.div>
            </div>

            {/* Directional Fly-In Services Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allEightServices.map((service, index) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  featured={service.isFeatured}
                  motionProps={getServiceMotionProps(index)}
                />
              ))}
            </div>

          </div>
        </section>

        {/* HOW IT WORKS — Sequential Process Journey */}
        <section id="how-it-works" className="pt-28 pb-20 bg-[#F7F8FA] scroll-mt-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            
            {/* Header Sequence */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-2xl mx-auto space-y-3"
            >
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block">
                HOW IT WORKS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Getting help shouldn't be complicated.
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm font-normal">
                Fixly streamlines local service booking into three seamless steps.
              </p>
            </motion.div>

            {/* Connected Step Journey Cards */}
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Step 1 (Slide in from Left) */}
              <motion.div 
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-xs space-y-4 relative z-10"
              >
                <motion.span 
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
                  className="text-3xl font-extrabold text-blue-600 font-mono block"
                >
                  01
                </motion.span>
                <h3 className="text-lg font-extrabold text-slate-900">Tell us what you need</h3>
                <p className="text-slate-600 text-xs leading-relaxed font-normal">
                  Choose a service category, describe your problem in simple words, and pick your preferred date and time.
                </p>
              </motion.div>

              {/* Step 2 (Slide in from Right) */}
              <motion.div 
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-xs space-y-4 relative z-10"
              >
                <motion.span 
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.4 }}
                  className="text-3xl font-extrabold text-indigo-600 font-mono block"
                >
                  02
                </motion.span>
                <h3 className="text-lg font-extrabold text-slate-900">Choose your professional</h3>
                <p className="text-slate-600 text-xs leading-relaxed font-normal">
                  Compare verified professionals by rating, location distance, hourly rate, and real customer reviews.
                </p>
              </motion.div>

              {/* Step 3 (Slide in from Left) */}
              <motion.div 
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-xs space-y-4 relative z-10"
              >
                <motion.span 
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.6 }}
                  className="text-3xl font-extrabold text-emerald-600 font-mono block"
                >
                  03
                </motion.span>
                <h3 className="text-lg font-extrabold text-slate-900">Get it done</h3>
                <p className="text-slate-600 text-xs leading-relaxed font-normal">
                  Track your service lifecycle live from request acceptance to start of work and job completion.
                </p>
              </motion.div>

            </div>

          </div>
        </section>

        {/* INTERACTIVE PRODUCT SHOWCASE SECTION — Rise-From-Page Animation */}
        <section className="py-20 bg-slate-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 text-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto space-y-4"
            >
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400 bg-blue-950 px-3 py-1 rounded-full border border-blue-800 inline-block">
                PRODUCT SHOWCASE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Designed like a modern tech product.
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm font-normal max-w-xl mx-auto">
                No outdated directories or phone tag. Manage all your local service requests from a clean dashboard.
              </p>
            </motion.div>

            {/* Rising App Preview Window */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.88, rotateX: 8, y: 80 }}
              whileInView={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-4xl mx-auto perspective-1000"
            >
              <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-10 shadow-2xl text-left space-y-6">
                
                {/* Mock Window Bar */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex space-x-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  </div>
                  <span className="text-xs font-mono text-slate-500 font-bold">fixly.app/customer/dashboard</span>
                </div>

                {/* Dashboard Body */}
                <div className="space-y-4">
                  <h3 className="text-xl font-extrabold text-white">Good evening, Vijay 👋</h3>
                  <p className="text-xs text-slate-400">What do you need help with today?</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-bold text-xs flex items-center space-x-2">
                      <Wrench className="w-4 h-4 text-blue-400" />
                      <span>Plumbing</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-bold text-xs flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>Electrical</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-bold text-xs flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Cleaning</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-bold text-xs flex items-center space-x-2">
                      <Wind className="w-4 h-4 text-cyan-400" />
                      <span>AC Repair</span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        </section>

        {/* TWO-SIDED MARKETPLACE — Professional Section */}
        <section id="about" className="pt-28 pb-20 bg-white border-b border-slate-200/80 scroll-mt-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <motion.div 
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-6 space-y-6"
              >
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                  FOR PROFESSIONALS
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Your skills deserve <br />
                  <span className="text-emerald-600">more customers.</span>
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm font-normal leading-relaxed">
                  Join Fixly to receive verified local jobs in your area. Accept requests on your terms, build your rating, and grow your local business.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center space-x-3 text-xs font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Direct customer service requests</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Set your own availability & service coverage</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Keep 100% of your listed earnings</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    to="/register?role=technician"
                    className="inline-flex items-center px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-colors"
                  >
                    <span>Register as a Professional</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </motion.div>

              {/* Professional Side Visual Card */}
              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="lg:col-span-6 space-y-4 bg-[#F7F8FA] p-8 rounded-3xl border border-slate-200"
              >
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase">Incoming Request Alert</span>
                    <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">NEW</span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900">Kitchen Sink Drainage Repair</h4>
                  <p className="text-xs text-slate-500">Customer: Vijay • Hiranandani Estate, Thane (2.4 km)</p>
                  <div className="pt-2 flex justify-between items-center text-xs">
                    <span className="font-extrabold text-emerald-600 text-sm">₹800 – ₹1,200</span>
                    <button className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-xs">
                      Accept Request
                    </button>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* TRUST SECTION & GIANT NUMBERS (Animated Count-Up) */}
        <section className="py-20 bg-[#F7F8FA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              
              <div className="space-y-2">
                <div className="text-5xl sm:text-6xl font-extrabold text-slate-900 font-mono tracking-tight">
                  <AnimatedCountUp target={10} suffix="K+" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Completed Bookings</span>
              </div>

              <div className="space-y-2">
                <div className="text-5xl sm:text-6xl font-extrabold text-blue-600 font-mono tracking-tight">
                  <AnimatedCountUp target={2} suffix="K+" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Verified Professionals</span>
              </div>

              <div className="space-y-2">
                <div className="text-5xl sm:text-6xl font-extrabold text-amber-500 font-mono tracking-tight">
                  <AnimatedCountUp target={4.8} decimals={1} suffix="★" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Average Rating</span>
              </div>

            </div>
          </div>
        </section>

        {/* DRAMATIC FINAL CTA SECTION */}
        <section className="py-20 bg-slate-900 text-white overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6"
          >
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Your next repair <br />
              <span className="text-blue-400">shouldn't be a headache.</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm font-normal max-w-xl mx-auto">
              Find someone who can handle it. Certified plumbers, electricians, cleaners, and mechanics ready in your area.
            </p>

            <div className="pt-4">
              <Link
                to="/technicians"
                className="inline-flex items-center px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-xl transition-all"
              >
                <span>Find a Professional</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}
