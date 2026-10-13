import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { showService } from '../services/showService';
import { movieService } from '../services/movieService';
import { screenService } from '../services/screenService';
import { theatreService } from '../services/theatreService';
import { paymentService } from '../services/paymentService';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { Ticket, Film, Calendar, Clock, MapPin, Printer, ArrowLeft, XCircle, CreditCard, QrCode } from 'lucide-react';
import { formatTime, formatDate, formatCurrency, formatDuration } from '../utils/formatters';

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [show, setShow] = useState(null);
  const [movie, setMovie] = useState(null);
  const [screen, setScreen] = useState(null);
  const [theatre, setTheatre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const loadBookingDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const bRes = await bookingService.getBookingById(bookingId);
      if (bRes && bRes.data) {
        const bData = bRes.data;
        setBooking(bData);

        if (bData.showId) {
          const sRes = await showService.getShowById(bData.showId).catch(() => null);
          if (sRes && sRes.data) {
            const sData = sRes.data;
            setShow(sData);

            const [mRes, scRes] = await Promise.all([
              movieService.getMovieById(sData.movieId).catch(() => null),
              screenService.getScreenById(sData.screenId).catch(() => null),
            ]);

            if (mRes && mRes.data) setMovie(mRes.data);
            if (scRes && scRes.data) {
              setScreen(scRes.data);
              if (scRes.data.theatreId) {
                const tRes = await theatreService.getTheatreById(scRes.data.theatreId).catch(() => null);
                if (tRes && tRes.data) setTheatre(tRes.data);
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to load booking ticket:', err);
      setError(err.response?.data?.message || 'Unable to retrieve ticket details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookingDetails();
  }, [bookingId]);

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking? If confirmed, an automatic refund will be issued.')) {
      return;
    }

    setIsCancelling(true);
    try {
      await bookingService.cancelBooking(booking.id);
      await loadBookingDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handlePayNow = async () => {
    try {
      const res = await paymentService.createCheckoutSession(booking.id);
      if (res && res.data && res.data.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to proceed to payment.');
    }
  };

  if (loading) return <Loading message="Loading digital ticket pass..." />;
  if (error) return <ErrorState message={error} onRetry={loadBookingDetails} />;
  if (!booking) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 min-h-screen">
      <div className="flex items-center justify-between mb-8 print:hidden">
        <Link
          to="/my-bookings"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Bookings
        </Link>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print Ticket
        </button>
      </div>

      <div className="bg-[#0D1117] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="bg-gradient-to-r from-[#EF233C] to-[#DC143C] px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5" />
            <span className="text-sm font-extrabold tracking-wider uppercase">MovieVerse Cinema Pass</span>
          </div>
          <span className="text-xs font-bold bg-black/30 px-3 py-1 rounded-full uppercase tracking-wider">
            Booking #{booking.id}
          </span>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start pb-6 border-b border-gray-800">
            <div className="w-24 sm:w-28 shrink-0 aspect-[2/3] rounded-2xl overflow-hidden bg-gray-900 border border-gray-800">
              {movie?.posterUrl ? (
                <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  <Film className="w-8 h-8" />
                </div>
              )}
            </div>

            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-[#EF233C] border border-red-500/20">
                  {movie?.genre || 'Feature Film'}
                </span>
                <span className="text-xs text-gray-400">{show?.language || booking?.showLanguage || movie?.language}</span>
              </div>

              <h2 className="text-2xl font-extrabold text-white mb-2">{movie?.title || 'Movie Title'}</h2>

              <p className="text-xs text-gray-400 flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-[#EF233C]" />
                <span className="font-semibold text-white">{theatre?.name}</span> ({theatre?.city})
              </p>
              <p className="text-xs text-gray-500">
                {screen?.name || `Screen ${show?.screenId}`} {screen?.screenType && `• ${screen.screenType}`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-gray-800 text-xs">
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-semibold">Date</span>
              <span className="font-bold text-white text-sm mt-0.5 block">{formatDate(show?.showDate)}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-semibold">Time</span>
              <span className="font-bold text-white text-sm mt-0.5 block">{formatTime(show?.startTime)}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-semibold">Seats</span>
              <span className="font-bold text-[#EF233C] text-sm mt-0.5 block">{booking.seatIds?.length || 0} Seat(s)</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-semibold">Status</span>
              <span
                className={`font-bold text-xs uppercase px-2 py-0.5 rounded inline-block mt-0.5 ${booking.status === 'CONFIRMED'
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : booking.status === 'PENDING_PAYMENT'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
              >
                {booking.status}
              </span>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white p-2 rounded-2xl flex items-center justify-center text-black">
                <QrCode className="w-16 h-16" />
              </div>
              <div className="text-xs text-gray-400">
                <span className="block font-semibold text-white">Scan at Gate</span>
                <span className="block text-[11px] text-gray-500">Show this QR on your device upon theatre entry</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-gray-500 block">Total Amount</span>
              <span className="text-2xl font-extrabold text-white">{formatCurrency(booking.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/60 border-t border-gray-800 p-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
          {booking.status === 'PENDING_PAYMENT' && (
            <button
              onClick={handlePayNow}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-green-600 hover:bg-green-500 transition-all shadow-md shadow-green-600/20"
            >
              <CreditCard className="w-4 h-4" />
              Complete Payment Now
            </button>
          )}

          {booking.status !== 'CANCELLED' && (
            <button
              onClick={handleCancelBooking}
              disabled={isCancelling}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-all ml-auto"
            >
              <XCircle className="w-4 h-4" />
              {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
