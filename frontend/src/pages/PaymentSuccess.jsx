import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Ticket, ArrowRight, Film } from 'lucide-react';

const PaymentSuccess = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#0D1117] border border-gray-800 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-500/10 animate-bounce">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-green-500/10 text-green-400 border border-green-500/20 mb-3">
          Payment Succeeded
        </span>

        <h1 className="text-2xl font-extrabold text-white tracking-tight mb-2">
          Your Booking is Confirmed!
        </h1>

        <p className="text-xs text-gray-400 mb-8 leading-relaxed max-w-xs mx-auto">
          Your payment has been verified by Stripe. Your seats are officially reserved and your digital ticket is ready.
        </p>

        <div className="space-y-3">
          <Link
            to="/my-bookings"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#EF233C] to-[#DC143C] hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Ticket className="w-4 h-4" />
            View My Bookings
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/movies"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-gray-900 hover:bg-gray-800 border border-gray-800 transition-colors"
          >
            <Film className="w-4 h-4" />
            Browse More Movies
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
