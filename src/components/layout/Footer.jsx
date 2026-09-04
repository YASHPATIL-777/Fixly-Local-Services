import React from 'react';
import { Link } from 'react-router-dom';
import { FixlyLogoIcon } from './Navbar';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info Column */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <FixlyLogoIcon className="w-8 h-8" />
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Fix<span className="text-blue-500">ly</span>
              </span>
            </Link>

            <p className="text-slate-400 text-xs sm:text-sm max-w-sm font-normal leading-relaxed">
              Fixly is the local-service marketplace connecting customers with verified repair and installation professionals in their neighborhood.
            </p>

            <div className="pt-2 text-xs font-semibold text-slate-400">
              Get the right professional. Get the job done.
            </div>
          </div>

          {/* Product Links */}
          <div className="md:col-span-2 space-y-3 text-xs">
            <h4 className="font-extrabold uppercase tracking-wider text-slate-400 text-[11px]">Product</h4>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li><Link to="/services" className="hover:text-white transition-colors">Browse Services</Link></li>
              <li><Link to="/technicians" className="hover:text-white transition-colors">Find Professionals</Link></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><Link to="/customer/dashboard" className="hover:text-white transition-colors">Customer Portal</Link></li>
            </ul>
          </div>

          {/* Professionals Links */}
          <div className="md:col-span-2 space-y-3 text-xs">
            <h4 className="font-extrabold uppercase tracking-wider text-slate-400 text-[11px]">Professionals</h4>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li><Link to="/register?role=technician" className="text-blue-400 hover:text-blue-300 font-semibold">Become a Professional</Link></li>
              <li><Link to="/technician/dashboard" className="hover:text-white transition-colors">Technician Portal</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Professional Login</Link></li>
            </ul>
          </div>

          {/* Company & Legal Links */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <h4 className="font-extrabold uppercase tracking-wider text-slate-400 text-[11px]">Company</h4>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li><a href="#about" className="hover:text-white transition-colors">About Fixly</a></li>
              <li><span className="text-slate-500 cursor-not-allowed">Terms of Service</span></li>
              <li><span className="text-slate-500 cursor-not-allowed">Privacy Policy</span></li>
              <li><span className="text-slate-500 cursor-not-allowed">Contact Support</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-medium gap-4">
          <p>© {new Date().getFullYear()} Fixly Inc. All rights reserved.</p>
          <p className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>All systems operational in Thane & Mumbai region</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
