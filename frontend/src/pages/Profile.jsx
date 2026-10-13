import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';
import { User, Mail, Shield, Ticket, Calendar, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    totalSeatsBooked: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user?.id) return;
      try {
        const res = await bookingService.getUserBookings(user.id);
        if (res && res.data) {
          const bookings = res.data;
          const confirmed = bookings.filter((b) => b.status === 'CONFIRMED');
          const seatsCount = confirmed.reduce((acc, b) => acc + (b.seatIds?.length || 0), 0);
          setStats({
            totalBookings: bookings.length,
            confirmedBookings: confirmed.length,
            totalSeatsBooked: seatsCount,
          });
        }
      } catch (e) {
        console.error('Failed to load user stats:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [user?.id]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <User className="w-8 h-8 text-[#EF233C]" />
          My Profile
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          View your cinema account details and booking activity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-[#0D1117] border border-gray-800 rounded-3xl p-6 text-center shadow-xl">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#EF233C] to-[#DC143C] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg shadow-red-500/20 border-2 border-red-400/30">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <h2 className="text-lg font-bold text-white mb-0.5">{user?.name}</h2>
          <p className="text-xs text-gray-400 mb-3">{user?.email}</p>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-800 text-amber-400 border border-amber-500/20 mb-6">
            <Shield className="w-3 h-3" />
            {user?.role || 'USER'} Account
          </span>

          <div className="border-t border-gray-800 pt-4 text-xs text-left text-gray-400 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Account ID:</span>
              <strong className="text-gray-200">#{user?.id}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Security:</span>
              <strong className="text-green-400">JWT Authenticated</strong>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#0D1117] border border-gray-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4 pb-3 border-b border-gray-800 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#EF233C]" />
              Cinema Activity Summary
            </h3>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800">
                <span className="text-2xl font-extrabold text-white block mb-1">
                  {stats.totalBookings}
                </span>
                <span className="text-[11px] text-gray-400 uppercase font-semibold">Total Bookings</span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800">
                <span className="text-2xl font-extrabold text-green-400 block mb-1">
                  {stats.confirmedBookings}
                </span>
                <span className="text-[11px] text-gray-400 uppercase font-semibold">Confirmed</span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800">
                <span className="text-2xl font-extrabold text-amber-400 block mb-1">
                  {stats.totalSeatsBooked}
                </span>
                <span className="text-[11px] text-gray-400 uppercase font-semibold">Seats Reserved</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0D1117] border border-gray-800 rounded-3xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Looking for your tickets?</h4>
              <p className="text-xs text-gray-400">View your active QR codes and booking passes.</p>
            </div>
            <Link
              to="/my-bookings"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gray-800 hover:bg-[#EF233C] transition-colors"
            >
              <Ticket className="w-4 h-4" />
              My Bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
