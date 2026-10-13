import React, { useState, useEffect, useMemo } from 'react';
import { theatreService } from '../services/theatreService';
import TheatreCard from '../components/TheatreCard';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { Compass, Search, MapPin, X } from 'lucide-react';

const Theatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadTheatres = async (city = null) => {
    setLoading(true);
    setError(null);
    try {
      const res = await theatreService.getAllTheatres(city);
      if (res && res.data) {
        setTheatres(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to fetch theatres');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTheatres(selectedCity || null);
  }, [selectedCity]);

  const cities = useMemo(() => {
    const set = new Set();
    theatres.forEach((t) => {
      if (t.city) set.add(t.city.trim());
    });
    return Array.from(set).sort();
  }, [theatres]);

  const filteredTheatres = useMemo(() => {
    return theatres.filter((t) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        t.name?.toLowerCase().includes(q) ||
        t.address?.toLowerCase().includes(q) ||
        t.pincode?.includes(q)
      );
    });
  }, [theatres, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Compass className="w-8 h-8 text-[#EF233C]" />
          Cinemas & Theatres
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Explore theatre locations, sound formats, and screen arrangements in your city
        </p>
      </div>

      <div className="bg-[#0D1117] border border-gray-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by theatre name, street or pincode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700/80 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#EF233C]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="relative">
            <MapPin className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700/80 text-white text-xs focus:outline-none focus:border-[#EF233C]"
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <Loading message="Finding theatre destinations..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => loadTheatres(selectedCity || null)} />
      ) : filteredTheatres.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No theatres found"
          description="There are currently no theatres matching your criteria. Try changing the city filter or search query."
          actionText="Clear Filters"
          onAction={() => {
            setSelectedCity('');
            setSearchQuery('');
          }}
        />
      ) : (
        <div>
          <div className="text-xs text-gray-400 mb-6">
            Showing <strong className="text-white">{filteredTheatres.length}</strong> {filteredTheatres.length === 1 ? 'theatre' : 'theatres'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTheatres.map((theatre) => (
              <TheatreCard key={theatre.id} theatre={theatre} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Theatres;
