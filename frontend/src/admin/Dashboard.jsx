import React, { useState, useEffect } from 'react';
import { movieService } from '../services/movieService';
import { theatreService } from '../services/theatreService';
import { bookingService } from '../services/bookingService';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { Film, Compass, Ticket, DollarSign, ArrowUpRight, TrendingUp } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    movieCount: 0,
    theatreCount: 0,
    bookingCount: 0,
    totalRevenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [moviesRes, theatresRes, bookingsRes] = await Promise.all([
        movieService.getAllMovies().catch(() => ({ data: [] })),
        theatreService.getAllTheatres().catch(() => ({ data: [] })),
        bookingService.getAllBookings().catch(() => ({ data: [] })),
      ]);

      const movies = moviesRes.data || [];
      const theatres = theatresRes.data || [];
      const bookings = bookingsRes.data || [];

      const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED');
      const revenue = confirmedBookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);

      setStats({
        movieCount: movies.length,
        theatreCount: theatres.length,
        bookingCount: bookings.length,
        totalRevenue: revenue,
      });

      setRecentBookings(bookings.slice(0, 6));
    } catch (err) {
      console.error('Admin dashboard load error:', err);
      setError(err.response?.data?.message || 'Unable to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading message="Compiling cinema analytics..." />;
  if (error) return <ErrorState message={error} onRetry={loadDashboardData} />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin Overview Dashboard</h1>
        <p className="text-xs text-gray-400 mt-1">Live metrics across catalog, venues, and customer reservations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#0D1117] border border-gray-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Active Movies</span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-[#EF233C] flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mb-1">{stats.movieCount}</div>
          <Link to="/admin/movies" className="text-[11px] text-[#EF233C] hover:underline flex items-center gap-1">
            Manage catalogue <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-[#0D1117] border border-gray-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Theatres</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mb-1">{stats.theatreCount}</div>
          <Link to="/admin/theatres" className="text-[11px] text-blue-400 hover:underline flex items-center gap-1">
            Manage locations <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-[#0D1117] border border-gray-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">All Bookings</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mb-1">{stats.bookingCount}</div>
          <Link to="/admin/bookings" className="text-[11px] text-amber-400 hover:underline flex items-center gap-1">
            Review admissions <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-[#0D1117] border border-gray-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Confirmed Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-green-400 mb-1">
            {formatCurrency(stats.totalRevenue)}
          </div>
          <span className="text-[11px] text-gray-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-400" /> Settled via Stripe
          </span>
        </div>
      </div>

      <div className="bg-[#0D1117] border border-gray-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-800">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Recent Customer Bookings</h3>
            <p className="text-xs text-gray-400">Latest reservations across all screens</p>
          </div>
          <Link
            to="/admin/bookings"
            className="text-xs font-semibold text-[#EF233C] hover:text-red-400 transition-colors"
          >
            View All ({stats.bookingCount})
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <p className="text-xs text-gray-500 py-6 text-center">No bookings recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-gray-800/80">
                  <th className="pb-3 font-semibold">Booking ID</th>
                  <th className="pb-3 font-semibold">User ID</th>
                  <th className="pb-3 font-semibold">Show ID</th>
                  <th className="pb-3 font-semibold">Seats</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-800/30">
                    <td className="py-3 font-bold text-white">#{b.id}</td>
                    <td className="py-3 text-gray-300">User #{b.userId}</td>
                    <td className="py-3 text-gray-300">Show #{b.showId}</td>
                    <td className="py-3 text-gray-300">{b.seatIds?.length || 0}</td>
                    <td className="py-3 font-semibold text-white">{formatCurrency(b.totalAmount)}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          b.status === 'CONFIRMED'
                            ? 'bg-green-500/10 text-green-400'
                            : b.status === 'PENDING_PAYMENT'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">{formatDate(b.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
