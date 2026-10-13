import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { Ticket, Search, Filter, XCircle, ChevronRight } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Link } from 'react-router-dom';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookingService.getAllBookings();
      if (res && res.data) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin bookings:', err);
      setError(err.response?.data?.message || 'Unable to retrieve master bookings list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm(`Are you sure you want to cancel booking #${bookingId}? If confirmed, Stripe refund will be triggered.`)) {
      return;
    }
    try {
      await bookingService.cancelBooking(bookingId);
      await loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      !search ||
      b.id?.toString().includes(search) ||
      b.userId?.toString().includes(search) ||
      b.showId?.toString().includes(search);

    const matchesStatus = !statusFilter || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Ticket className="w-6 h-6 text-[#EF233C]" />
          Master Booking Ledger
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Monitor all customer transactions, ticket statuses, and process cancellations
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#0D1117] border border-gray-800 rounded-2xl p-4">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Booking ID, User ID, or Show ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#EF233C]"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs text-white focus:outline-none focus:border-[#EF233C]"
          >
            <option value="">All Statuses</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {loading ? (
        <Loading message="Loading booking records..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadBookings} />
      ) : (
        <div className="bg-[#0D1117] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-900/60 text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Booking ID</th>
                  <th className="py-3.5 px-4 font-semibold">Customer</th>
                  <th className="py-3.5 px-4 font-semibold">Show Session</th>
                  <th className="py-3.5 px-4 font-semibold">Seat Count</th>
                  <th className="py-3.5 px-4 font-semibold">Total Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Creation Date</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-gray-500">
                      No matching booking records found.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-800/30">
                      <td className="py-3 px-4 font-bold text-white">#{b.id}</td>
                      <td className="py-3 px-4 text-gray-300">User #{b.userId}</td>
                      <td className="py-3 px-4 text-gray-300">Show #{b.showId}</td>
                      <td className="py-3 px-4 text-gray-300 font-semibold">{b.seatIds?.length || 0} seats</td>
                      <td className="py-3 px-4 font-bold text-white">{formatCurrency(b.totalAmount)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            b.status === 'CONFIRMED'
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                              : b.status === 'PENDING_PAYMENT'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{formatDate(b.createdAt)}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/bookings/${b.id}`}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                            title="View Ticket"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                          {b.status !== 'CANCELLED' && (
                            <button
                              onClick={() => handleCancelBooking(b.id)}
                              className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                              title="Cancel & Refund"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
