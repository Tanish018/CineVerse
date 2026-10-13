import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, DollarSign, XCircle, CreditCard, ChevronRight } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

const BookingCard = ({ booking, onCancel, onPayNow }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-green-500/10 text-green-400 border border-green-500/20">
            Confirmed
          </span>
        );
      case 'PENDING_PAYMENT':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Pending Payment
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-red-500/10 text-red-400 border border-red-500/20">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gray-800 text-gray-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-800/80 border border-gray-700/60 flex items-center justify-center text-[#EF233C]">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Booking ID</span>
            <h4 className="text-base font-bold text-white">#{booking.id}</h4>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {getStatusBadge(booking.status)}
          <span className="text-base font-bold text-white">{formatCurrency(booking.totalAmount)}</span>
        </div>
      </div>

      <div className="py-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <span className="text-gray-500 block mb-0.5">Show ID</span>
          <span className="text-gray-200 font-medium">Show #{booking.showId}{booking.showLanguage ? ` • ${booking.showLanguage}` : ''}</span>
        </div>
        <div>
          <span className="text-gray-500 block mb-0.5">Total Seats</span>
          <span className="text-gray-200 font-medium">{booking.seatIds?.length || 0} Seat(s)</span>
        </div>
        <div>
          <span className="text-gray-500 block mb-0.5">Booked On</span>
          <span className="text-gray-200 font-medium">{formatDate(booking.createdAt)}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-800 flex flex-wrap items-center justify-between gap-3">
        <Link
          to={`/bookings/${booking.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
        >
          View Ticket Details
          <ChevronRight className="w-4 h-4" />
        </Link>

        <div className="flex items-center gap-2">
          {booking.status === 'PENDING_PAYMENT' && onPayNow && (
            <button
              onClick={() => onPayNow(booking.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-green-600 hover:bg-green-500 shadow-md shadow-green-600/20 transition-all"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Pay Now
            </button>
          )}

          {booking.status !== 'CANCELLED' && onCancel && (
            <button
              onClick={() => onCancel(booking.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-all"
            >
              <XCircle className="w-3.5 h-3.5" />
              Cancel Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
