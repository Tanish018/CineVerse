import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import BookingCard from '../components/BookingCard';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { Ticket, Film, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');

  const loadBookings = async () => {
    if (!user || !user.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await bookingService.getUserBookings(user.id);
      if (res && res.data) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error('Error fetching user bookings:', err);
      setError(err.response?.data?.message || 'Unable to retrieve your booking history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [user?.id]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? If paid, an automatic refund will be triggered.')) {
      return;
    }
    try {
      await bookingService.cancelBooking(bookingId);
      await loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    }
  };

  const handlePayNow = async (bookingId) => {
    try {
      const res = await paymentService.createCheckoutSession(bookingId);
      if (res && res.data && res.data.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to create payment session.');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'ALL') return true;
    return b.status === activeTab;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Ticket className="w-8 h-8 text-[#EF233C]" />
            My Bookings
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Track your reserved seats, completed cinema admissions, and transaction statuses
          </p>
        </div>

        <Link
          to="/movies"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#EF233C] to-[#DC143C] hover:from-red-600 hover:to-red-700 shadow-md shadow-red-500/20"
        >
          <Film className="w-4 h-4" />
          Book New Tickets
        </Link>
      </div>

      <div className="flex items-center gap-2 border-b border-gray-800 pb-4 mb-8 overflow-x-auto scrollbar-none">
        {[
          { label: 'All Bookings', value: 'ALL' },
          { label: 'Confirmed', value: 'CONFIRMED' },
          { label: 'Pending Payment', value: 'PENDING_PAYMENT' },
          { label: 'Cancelled', value: 'CANCELLED' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${activeTab === tab.value
                ? 'bg-gray-800 text-white border border-gray-700 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-gray-900/60'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Loading message="Fetching your booking tickets..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadBookings} />
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No bookings in this category"
          description={
            activeTab === 'ALL'
              ? 'You have not booked any movie tickets yet. Start exploring now!'
              : `You have no ${activeTab.toLowerCase().replace('_', ' ')} bookings.`
          }
          actionText="Browse Now Showing"
          onAction={() => (window.location.href = '/movies')}
        />
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancel}
              onPayNow={handlePayNow}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
