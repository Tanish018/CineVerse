import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { movieService } from '../services/movieService';
import MovieGrid from '../components/MovieGrid';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { Search, Filter, Film, RefreshCw, X } from 'lucide-react';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('search') || '';
  const selectedGenre = searchParams.get('genre') || '';
  const selectedLanguage = searchParams.get('language') || '';

  const loadMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await movieService.getAllMovies();
      if (res && res.data) {
        setMovies(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to fetch movies from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const genres = useMemo(() => {
    const set = new Set();
    movies.forEach((m) => {
      if (m.genre) {
        m.genre.split(',').forEach((g) => set.add(g.trim()));
      }
    });
    return Array.from(set).sort();
  }, [movies]);

  const languages = useMemo(() => {
    const set = new Set();
    movies.forEach((m) => {
      if (m.language) {
        m.language.split(',').forEach((l) => {
          const trimmed = l.trim();
          if (trimmed) set.add(trimmed);
        });
      }
    });
    return Array.from(set).sort();
  }, [movies]);

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesSearch =
        !searchQuery ||
        movie.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGenre =
        !selectedGenre ||
        movie.genre?.toLowerCase().includes(selectedGenre.toLowerCase());

      const matchesLanguage =
        !selectedLanguage ||
        movie.language
          ?.split(',')
          .map((l) => l.trim().toLowerCase())
          .includes(selectedLanguage.toLowerCase());

      return matchesSearch && matchesGenre && matchesLanguage;
    });
  }, [movies, searchQuery, selectedGenre, selectedLanguage]);

  const updateFilter = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    setSearchParams(nextParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="relative mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0D1117] via-[#111827] to-[#0D1117] border border-gray-800 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/10 text-[#EF233C] border border-red-500/20 mb-3 shadow-sm shadow-red-500/10">
              <Film className="w-3.5 h-3.5" />
              Now In Theatres & Upcoming
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Explore Movies
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1.5 max-w-xl leading-relaxed">
              Browse our comprehensive catalog of movies currently playing in cinemas, discover showtimes, and book your seats instantly.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-4 py-2 rounded-2xl bg-gray-900/90 border border-gray-800 text-xs font-semibold text-gray-300">
              {filteredMovies.length} {filteredMovies.length === 1 ? 'Movie' : 'Movies'} Available
            </span>
          </div>
        </div>
      </div>

      <div className="bg-[#0D1117] border border-gray-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by movie title..."
              value={searchQuery}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700/80 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#EF233C]"
            />
            {searchQuery && (
              <button
                onClick={() => updateFilter('search', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div>
            <select
              value={selectedGenre}
              onChange={(e) => updateFilter('genre', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700/80 text-white text-xs focus:outline-none focus:border-[#EF233C]"
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedLanguage}
              onChange={(e) => updateFilter('language', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700/80 text-white text-xs focus:outline-none focus:border-[#EF233C]"
            >
              <option value="">All Languages</option>
              {languages.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(searchQuery || selectedGenre || selectedLanguage) && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-800 text-xs">
            <span className="text-gray-400">Active Filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-800 text-white border border-gray-700">
                "{searchQuery}"
                <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('search', '')} />
              </span>
            )}
            {selectedGenre && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-800 text-white border border-gray-700">
                Genre: {selectedGenre}
                <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('genre', '')} />
              </span>
            )}
            {selectedLanguage && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-800 text-white border border-gray-700">
                Language: {selectedLanguage}
                <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('language', '')} />
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-[#EF233C] hover:text-red-400 font-semibold ml-auto transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <Loading message="Filtering movies..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadMovies} />
      ) : filteredMovies.length === 0 ? (
        <EmptyState
          title="No movies found"
          description="Try adjusting your search terms or clearing your selected filters."
          actionText="Clear All Filters"
          onAction={clearFilters}
        />
      ) : (
        <div>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-6">
            <span>
              Showing <strong className="text-white">{filteredMovies.length}</strong> {filteredMovies.length === 1 ? 'movie' : 'movies'}
            </span>
          </div>
          <MovieGrid movies={filteredMovies} />
        </div>
      )}
    </div>
  );
};

export default Movies;
