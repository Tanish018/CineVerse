import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, Ticket, ArrowLeft, RefreshCw } from 'lucide-react';

const PaymentCancel = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#0D1117] border border-gray-800 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-500/10">
          <XCircle className="w-8 h-8" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
          Payment Cancelled
        </span>

        <h1 className="text-2xl font-extrabold text-white tracking-tight mb-2">
          Transaction Incomplete
        </h1>

        <p className="text-xs text-gray-400 mb-8 leading-relaxed max-w-xs mx-auto">
          The payment checkout session was cancelled or closed. You can complete payment from your bookings dashboard before seats expire.
        </p>

        <div className="space-y-3">
          <Link
            to="/my-bookings"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#EF233C] to-[#DC143C] hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Ticket className="w-4 h-4" />
            Check My Bookings
          </Link>

          <Link
            to="/movies"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-gray-900 hover:bg-gray-800 border border-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Movies
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
