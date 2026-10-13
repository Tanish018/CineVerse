import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { theatreService } from '../services/theatreService';
import { screenService } from '../services/screenService';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { MapPin, Compass, Tv, Armchair, ChevronRight, Film } from 'lucide-react';

const TheatreDetails = () => {
  const { theatreId } = useParams();
  const [theatre, setTheatre] = useState(null);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTheatreAndScreens = async () => {
      setLoading(true);
      setError(null);
      try {
        const [theatreRes, screensRes] = await Promise.all([
          theatreService.getTheatreById(theatreId),
          screenService.getScreensByTheatre(theatreId),
        ]);

        if (theatreRes && theatreRes.data) {
          setTheatre(theatreRes.data);
        }
        if (screensRes && screensRes.data) {
          setScreens(screensRes.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load theatre details');
      } finally {
        setLoading(false);
      }
    };

    loadTheatreAndScreens();
  }, [theatreId]);

  if (loading) return <Loading message="Loading venue details and screens..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!theatre) return <EmptyState title="Theatre not found" description="The requested theatre does not exist." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="bg-[#0D1117] border border-gray-800 rounded-3xl p-6 sm:p-8 mb-10 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-gray-800 text-gray-300 mb-3 border border-gray-700">
              <MapPin className="w-3.5 h-3.5 text-[#EF233C]" />
              {theatre.city}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              {theatre.name}
            </h1>

            <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
              {theatre.address} {theatre.pincode && `• PIN: ${theatre.pincode}`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gray-900 border border-gray-800 text-center">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold block">
                Total Screens
              </span>
              <span className="text-xl font-extrabold text-white">{theatre.numberOfScreens}</span>
            </div>

            <Link
              to="/movies"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#EF233C] to-[#DC143C] shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Film className="w-4 h-4" />
              Book Movie Here
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Tv className="w-5 h-5 text-[#EF233C]" />
            Auditoriums & Screens ({screens.length})
          </h2>
        </div>

        {screens.length === 0 ? (
          <EmptyState
            icon={Tv}
            title="No active screens configured"
            description="Screens for this theatre venue are currently being organized."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {screens.map((screen) => (
              <div
                key={screen.id}
                className="bg-[#111827] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Screen #{screen.screenNumber}
                      </span>
                      <h3 className="text-lg font-bold text-white">{screen.name}</h3>
                    </div>
                    {screen.screenType && (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {screen.screenType}
                      </span>
                    )}
                  </div>

                  <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800 mb-4">
                    <div className="text-xs text-gray-400 flex items-center justify-between mb-2">
                      <span>Total Capacity:</span>
                      <strong className="text-white">{screen.capacity} Seats</strong>
                    </div>

                    <div className="grid grid-cols-3 gap-1 pt-2 border-t border-gray-800/80 text-center text-[10px]">
                      <div>
                        <span className="text-blue-400 font-semibold block">{screen.regularSeats}</span>
                        <span className="text-gray-500">Regular</span>
                      </div>
                      <div>
                        <span className="text-amber-400 font-semibold block">{screen.premiumSeats}</span>
                        <span className="text-gray-500">Premium</span>
                      </div>
                      <div>
                        <span className="text-purple-400 font-semibold block">{screen.reclinerSeats}</span>
                        <span className="text-gray-500">Recliner</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 flex items-center justify-between pt-2">
                  <span>Equipped with 4K Laser & Surround Sound</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TheatreDetails;
