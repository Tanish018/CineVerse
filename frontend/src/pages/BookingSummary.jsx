import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import { Ticket, Film, Calendar, Clock, MapPin, Shield, CreditCard, ArrowLeft, AlertCircle } from 'lucide-react';
import { formatTime, formatDate, formatCurrency, formatDuration } from '../utils/formatters';

const BookingSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const bookingState = location.state;

  if (!bookingState || !bookingState.selectedSeats || bookingState.selectedSeats.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-[#0D1117] border border-gray-800 rounded-3xl p-8 shadow-2xl">
          <Ticket className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">No Active Booking Session</h2>
          <p className="text-xs text-gray-400 mb-6">
            Please choose a movie, select an auditorium showtime, and pick your seats to proceed.
          </p>
          <Link
            to="/movies"
            className="inline-block px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#EF233C] hover:bg-red-600 transition-colors"
          >
            Browse Movies
          </Link>
        </div>
      </div>
    );
  }

  const { show, movie, screen, theatre, selectedSeats } = bookingState;

  const totalAmount = selectedSeats.reduce((sum, seat) => sum + (Number(seat.price) || 0), 0);
  const seatIds = selectedSeats.map((s) => s.seatId);

  const handleProceedToPayment = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    if (!user || !user.id) {
      setError('User profile is not properly loaded. Please sign out and sign in again.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const bookingPayload = {
        userId: user.id,
        showId: show.id,
        seatIds: seatIds,
      };

      const bookingRes = await bookingService.createBooking(bookingPayload);
      if (!bookingRes || !bookingRes.data || !bookingRes.data.id) {
        throw new Error('Failed to create booking.');
      }

      const bookingId = bookingRes.data.id;

      const paymentRes = await paymentService.createCheckoutSession(bookingId);
      if (paymentRes && paymentRes.data && paymentRes.data.checkoutUrl) {
        window.location.href = paymentRes.data.checkoutUrl;
      } else {
        throw new Error('Unable to retrieve Stripe checkout URL.');
      }
    } catch (err) {
      console.error('Booking / Payment error:', err);
      setError(
        err.response?.data?.message || err.message || 'Unable to proceed to payment. Seats might have been taken.'
      );
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Seat Selection
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Ticket className="w-8 h-8 text-[#EF233C]" />
          Review Booking Summary
        </h1>
        <p className="text-xs text-gray-400 mt-1">Confirm your cinema choices before proceeding to payment</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-xs text-red-400 animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#0D1117] border border-gray-800 rounded-3xl p-6 shadow-xl flex gap-5">
            <div className="w-24 sm:w-28 shrink-0 aspect-[2/3] rounded-xl overflow-hidden bg-gray-900 border border-gray-800">
              {movie?.posterUrl ? (
                <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  <Film className="w-8 h-8" />
                </div>
              )}
            </div>

            <div className="flex-grow flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-[#EF233C] border border-red-500/20">
                  {movie?.genre || 'Cinema'}
                </span>
                <h3 className="text-xl font-bold text-white mt-1.5">{movie?.title}</h3>
                <span className="text-xs text-gray-400">{show?.language || movie?.language} • {formatDuration(movie?.durationMinutes)}</span>
              </div>

              <div className="pt-3 border-t border-gray-800/80 text-xs text-gray-400 space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#EF233C]" />
                  <span className="font-semibold text-white">{theatre?.name}</span> ({theatre?.city})
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Screen:</span>
                  <span className="text-gray-200">{screen?.name}</span>
                  {screen?.screenType && <span className="text-amber-400">({screen.screenType})</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0D1117] border border-gray-800 rounded-3xl p-6 shadow-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Date & Time</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-900/60 border border-gray-800">
                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-[#EF233C]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">Show Date</span>
                  <span className="text-xs font-bold text-white">{formatDate(show?.showDate)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-900/60 border border-gray-800">
                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-[#EF233C]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">Show Time</span>
                  <span className="text-xs font-bold text-white">{formatTime(show?.startTime)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0D1117] border border-gray-800 rounded-3xl p-6 shadow-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
              Selected Seats ({selectedSeats.length})
            </h4>

            <div className="divide-y divide-gray-800/80">
              {selectedSeats.map((seat) => (
                <div key={seat.seatId} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white px-2 py-0.5 rounded bg-gray-800 border border-gray-700">
                      {seat.seatNumber}
                    </span>
                    <span className="text-gray-400 uppercase text-[10px]">
                      {seat.seatType}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-200">
                    {formatCurrency(seat.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-[#0D1117] border border-gray-800 rounded-3xl p-6 shadow-2xl sticky top-24">
            <h3 className="text-base font-bold text-white tracking-tight mb-4 pb-3 border-b border-gray-800">
              Payment Breakdown
            </h3>

            <div className="space-y-3 text-xs mb-6">
              <div className="flex items-center justify-between text-gray-400">
                <span>Tickets ({selectedSeats.length}x):</span>
                <span className="text-white font-medium">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Booking Convenience Fee:</span>
                <span className="text-green-400 font-medium">FREE</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Applicable Taxes:</span>
                <span className="text-green-400 font-medium">Included</span>
              </div>

              <div className="pt-3 border-t border-gray-800 flex items-center justify-between text-sm">
                <span className="font-bold text-white">Total Amount</span>
                <span className="text-xl font-extrabold text-[#EF233C]">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            <div className="mb-6 p-3 rounded-2xl bg-gray-900/60 border border-gray-800 text-[11px] text-gray-400 space-y-1.5">
              <p className="flex items-center gap-1.5 text-gray-300 font-medium">
                <Shield className="w-3.5 h-3.5 text-green-400" />
                Stripe Secure Payment
              </p>
              <p className="text-gray-500">
                You will be securely redirected to Stripe Checkout to finalize your payment.
              </p>
            </div>

            <button
              onClick={handleProceedToPayment}
              disabled={isProcessing}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#EF233C] to-[#DC143C] hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <CreditCard className="w-4 h-4" />
              {isProcessing ? 'Redirecting to Stripe...' : 'Pay with Stripe'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
