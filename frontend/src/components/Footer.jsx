import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, Shield, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#070B12] border-t border-gray-900 text-gray-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 group mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#EF233C] to-[#DC143C] flex items-center justify-center">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Cine<span className="text-[#EF233C]">Verse</span>
              </span>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your premier portal for the ultimate cinema experience. Book tickets, choose your favorite seats, and enjoy movies with ease.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-200 tracking-wider uppercase mb-3">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/movies" className="hover:text-white transition-colors">Now Showing</Link></li>
              <li><Link to="/my-bookings" className="hover:text-white transition-colors">My Bookings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-200 tracking-wider uppercase mb-3">Trust & Security</h4>
            <div className="space-y-2 text-xs text-gray-500">
              <p className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-green-400" /> Stripe 256-bit Encrypted Checkout</p>
              <p className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-amber-400" /> Real-time Seat Allocation</p>
              <p className="flex items-center gap-1.5">⚡ Instant Digital Ticket Confirmation</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-200 tracking-wider uppercase mb-3">Seat Categories</h4>
            <ul className="space-y-1.5 text-xs text-gray-500">
              <li><span className="text-gray-300 font-medium">Regular:</span> Everyday cinema comfort</li>
              <li><span className="text-gray-300 font-medium">Premium:</span> Enhanced viewing angle & legroom</li>
              <li><span className="text-gray-300 font-medium">Recliner:</span> Luxury motorized seating</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600 gap-4">
          <p>© {new Date().getFullYear()} MovieVerse Technologies. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3 h-3 text-[#EF233C] fill-current" /> for movie lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
