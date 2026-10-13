import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Film,
  Compass,
  Tv,
  Armchair,
  Calendar,
  Ticket,
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Movies', path: '/admin/movies', icon: Film },
    { name: 'Theatres', path: '/admin/theatres', icon: Compass },
    { name: 'Screens', path: '/admin/screens', icon: Tv },
    { name: 'Seats', path: '/admin/seats', icon: Armchair },
    { name: 'Shows', path: '/admin/shows', icon: Calendar },
    { name: 'Bookings', path: '/admin/bookings', icon: Ticket },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#070B12] text-gray-200 flex">
      <aside className="hidden lg:flex flex-col w-64 bg-[#0D1117] border-r border-gray-800 shrink-0">
        <div className="h-16 px-6 flex items-center justify-between border-b border-gray-800">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#EF233C] to-[#DC143C] flex items-center justify-center shadow-md shadow-red-500/20">
              <Film className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">
              Movie<span className="text-[#EF233C]">Verse</span>
              <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase font-semibold">
                Admin
              </span>
            </span>
          </Link>
        </div>

        <nav className="flex-grow p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-[#EF233C] text-white shadow-md shadow-red-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800/40 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Switch to Customer View
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-grow flex flex-col min-w-0">
        <header className="h-16 bg-[#0D1117]/80 backdrop-blur-md border-b border-gray-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Cinema Management Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs font-semibold text-white">
              {user?.name || 'Administrator'}
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-amber-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative w-64 bg-[#0D1117] border-r border-gray-800 p-4 flex flex-col justify-between z-10">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-4">
                  <span className="text-base font-bold text-white">Admin Navigation</span>
                  <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                          active ? 'bg-[#EF233C] text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-gray-800 space-y-2">
                <Link
                  to="/"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Customer Portal
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="p-4 sm:p-8 flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
