import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { movieService } from '../services/movieService';
import { showService } from '../services/showService';
import { theatreService } from '../services/theatreService';
import { screenService } from '../services/screenService';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { Clock, Calendar, Globe, Ticket, Film, MapPin } from 'lucide-react';
import { formatDuration, formatDate, formatTime, formatCurrency } from '../utils/formatters';

const MovieDetails = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [allTheatres, setAllTheatres] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem('movieverse_city') || '';
  });
  const [shows, setShows] = useState([]);
  const [screensMap, setScreensMap] = useState({});
  const [theatresMap, setTheatresMap] = useState({});
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [loading, setLoading] = useState(true);
  const [loadingShows, setLoadingShows] = useState(false);
  const [error, setError] = useState(null);

  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    return { dateStr, dayName, dayNum, month };
  });

  useEffect(() => {
    const loadMovieAndTheatres = async () => {
      setLoading(true);
      setError(null);
      try {
        const [movieRes, theatresRes] = await Promise.all([
          movieService.getMovieById(movieId),
          theatreService.getAllTheatres().catch(() => ({ data: [] })),
        ]);

        if (movieRes && movieRes.data) {
          setMovie(movieRes.data);
        }

        if (theatresRes && theatresRes.data) {
          const tList = theatresRes.data;
          setAllTheatres(tList);

          const tMap = {};
          const citiesSet = new Set();
          tList.forEach((t) => {
            tMap[t.id] = t;
            if (t.city) citiesSet.add(t.city.trim());
          });
          setTheatresMap(tMap);

          const citiesArr = Array.from(citiesSet).sort();
          setAvailableCities(citiesArr);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load movie details');
      } finally {
        setLoading(false);
      }
    };

    loadMovieAndTheatres();
  }, [movieId]);

  useEffect(() => {
    const loadShows = async () => {
      if (!movieId) return;
      setLoadingShows(true);
      try {
        const showsRes = await showService.getShowsByMovieAndDate(movieId, selectedDate);
        if (showsRes && showsRes.data) {
          setShows(showsRes.data);

          const screenIds = Array.from(new Set(showsRes.data.map((s) => s.screenId)));
          const sMap = { ...screensMap };
          await Promise.all(
            screenIds.map(async (sId) => {
              if (!sMap[sId]) {
                try {
                  const sRes = await screenService.getScreenById(sId);
                  if (sRes && sRes.data) {
                    sMap[sId] = sRes.data;
                  }
                } catch (e) {
                }
              }
            })
          );
          setScreensMap(sMap);
        } else {
          setShows([]);
        }
      } catch (err) {
        console.error('Failed to load shows for date:', err);
        setShows([]);
      } finally {
        setLoadingShows(false);
      }
    };

    loadShows();
  }, [movieId, selectedDate]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    localStorage.setItem('movieverse_city', city);
  };

  if (loading) return <Loading message="Loading movie overview & showtimes..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!movie) return <EmptyState title="Movie not found" description="The requested movie does not exist." />;

  const cityTheatres = allTheatres.filter(
    (t) => !selectedCity || t.city?.toLowerCase() === selectedCity.toLowerCase()
  );
  const cityTheatreIds = new Set(cityTheatres.map((t) => t.id));

  const showsByTheatre = {};
  shows.forEach((show) => {
    const screen = screensMap[show.screenId];
    if (screen && cityTheatreIds.has(screen.theatreId)) {
      const theatreId = screen.theatreId;
      if (!showsByTheatre[theatreId]) {
        showsByTheatre[theatreId] = {
          theatre: theatresMap[theatreId],
          screens: {},
        };
      }
      if (!showsByTheatre[theatreId].screens[show.screenId]) {
        showsByTheatre[theatreId].screens[show.screenId] = {
          screen,
          showList: [],
        };
      }
      showsByTheatre[theatreId].screens[show.screenId].showList.push(show);
    }
  });

  const theatreEntries = Object.values(showsByTheatre);

  return (
    <div className="min-h-screen pb-16">
      <div className="relative isolate overflow-hidden bg-[#070B12] border-b border-gray-800 py-10 sm:py-14">
        {(movie.heroImageUrl || movie.posterUrl) && (
          <img
            src={movie.heroImageUrl || movie.posterUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center opacity-30 filter blur-[1px] transform scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070B12] via-[#070B12]/85 to-[#070B12]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B12] via-transparent to-black/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full sm:w-64 md:w-72 shrink-0 aspect-[2/3] rounded-2xl overflow-hidden bg-gray-900 border border-gray-700/80 shadow-2xl shadow-black/80 ring-1 ring-white/10 group">
              {movie.posterUrl ? (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 p-4">
                  <Film className="w-16 h-16 mb-2 text-[#EF233C]" />
                  <span className="text-sm font-semibold">{movie.title}</span>
                </div>
              )}
            </div>

            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {movie.genre && (
                  <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-red-500/15 text-[#EF233C] border border-red-500/30 shadow-sm shadow-red-500/10">
                    {movie.genre}
                  </span>
                )}
                {movie.language && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {movie.language.split(',').map((lang) => (
                      <span
                        key={lang.trim()}
                        className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-sky-500/15 text-sky-400 border border-sky-500/30"
                      >
                        {lang.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-md">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-200 mb-6 font-medium">
                {movie.durationMinutes && (
                  <span className="flex items-center gap-1.5 bg-gray-900/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-gray-800 text-gray-200 shadow-sm">
                    <Clock className="w-4 h-4 text-[#EF233C]" />
                    {formatDuration(movie.durationMinutes)}
                  </span>
                )}
                {movie.releaseDate && (
                  <span className="flex items-center gap-1.5 bg-gray-900/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-gray-800 text-gray-200 shadow-sm">
                    <Calendar className="w-4 h-4 text-[#EF233C]" />
                    Release: {formatDate(movie.releaseDate)}
                  </span>
                )}
                {movie.language && (
                  <span className="flex items-center gap-1.5 bg-gray-900/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-gray-800 text-gray-200 shadow-sm">
                    <Globe className="w-4 h-4 text-[#EF233C]" />
                    {movie.language}
                  </span>
                )}
              </div>

              <div className="border-t border-gray-800/80 pt-5 max-w-3xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">About the Movie</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
                  {movie.description || 'No detailed synopsis provided for this cinematic title.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {!selectedCity ? (
          <div className="bg-[#0D1117] border border-gray-800 rounded-3xl p-8 sm:p-10 mb-8 shadow-2xl max-w-2xl mx-auto text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4 text-[#EF233C] shadow-lg shadow-red-500/10">
              <MapPin className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
              Select Your City
            </h2>
            <p className="text-sm text-gray-400 mb-8 max-w-md mx-auto">
              Please choose your city to view available theatres, screen formats (IMAX, Dolby), and showtimes for <span className="text-white font-semibold">{movie.title}</span>.
            </p>

            {availableCities.length === 0 ? (
              <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 text-xs text-gray-500">
                No theatres currently registered. Please check back later.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableCities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleCitySelect(city)}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-900 border border-gray-800 hover:border-[#EF233C] hover:bg-gray-800/80 text-white font-medium text-sm transition-all group shadow-md"
                  >
                    <MapPin className="w-5 h-5 text-gray-500 group-hover:text-[#EF233C] transition-colors mb-2" />
                    <span>{city}</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">
                      {allTheatres.filter((t) => t.city?.toLowerCase() === city.toLowerCase()).length} {allTheatres.filter((t) => t.city?.toLowerCase() === city.toLowerCase()).length === 1 ? 'theatre' : 'theatres'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="bg-[#0D1117] border border-gray-800 rounded-2xl px-6 py-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[#EF233C]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Selected Location</span>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {selectedCity}
                    <span className="text-xs font-normal text-gray-400">
                      ({cityTheatres.length} {cityTheatres.length === 1 ? 'theatre' : 'theatres'} available)
                    </span>
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCity('')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-gray-800/80 hover:bg-gray-700 border border-gray-700 transition-all"
                >
                  Change City
                </button>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-800">
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#EF233C]" />
                  Select Date
                </h2>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
                {availableDates.map((item) => {
                  const isSelected = selectedDate === item.dateStr;
                  return (
                    <button
                      key={item.dateStr}
                      onClick={() => setSelectedDate(item.dateStr)}
                      className={`flex flex-col items-center justify-center min-w-[76px] py-2.5 px-3 rounded-2xl border text-xs transition-all ${isSelected
                          ? 'bg-[#EF233C] text-white border-[#EF233C] shadow-lg shadow-red-500/20 font-bold'
                          : 'bg-gray-900/60 text-gray-400 border-gray-800 hover:border-gray-700 hover:text-white'
                        }`}
                    >
                      <span className="text-[10px] uppercase tracking-wider">{item.dayName}</span>
                      <span className="text-base font-extrabold my-0.5">{item.dayNum}</span>
                      <span className="text-[10px] uppercase">{item.month}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-800">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
                    <Ticket className="w-5 h-5 text-[#EF233C]" />
                    Theatres in {selectedCity}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Showing scheduled screenings for {formatDate(selectedDate)}
                  </p>
                </div>
              </div>

              {loadingShows ? (
                <Loading message={`Fetching live showtimes in ${selectedCity} for ${formatDate(selectedDate)}...`} />
              ) : theatreEntries.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title={`No shows found in ${selectedCity} on this date`}
                  description="There are currently no active screenings for this movie on the chosen date. Try selecting another date from the tabs above or check another city."
                />
              ) : (
                <div className="space-y-6">
                  {theatreEntries.map(({ theatre, screens }) => (
                    <div
                      key={theatre.id}
                      className="bg-[#0D1117] border border-gray-800 rounded-3xl p-6 shadow-xl"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-gray-800/80">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white">{theatre.name}</h3>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-800 text-gray-300">
                              {theatre.city}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#EF233C]" />
                            {theatre.address}
                          </p>
                        </div>

                        <span className="text-xs text-gray-400">
                          {theatre.numberOfScreens} Screens Total
                        </span>
                      </div>

                      <div className="space-y-5">
                        {Object.values(screens).map(({ screen, showList }) => {
                          return (
                            <div key={screen.id} className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800">
                              <div className="flex items-center gap-2 flex-wrap mb-4">
                                <span className="text-sm font-bold text-white">{screen.name}</span>
                                {screen.screenType && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                    {screen.screenType}
                                  </span>
                                )}
                                <span className="text-[11px] text-gray-500">
                                  {showList.length} {showList.length === 1 ? 'show' : 'shows'}
                                </span>
                              </div>

                              <div className="grid gap-3 sm:grid-cols-2">
                                {showList.map((show) => (
                                  <div
                                    key={show.id}
                                    className="rounded-xl border border-gray-700 bg-[#0D1117] p-4 transition-colors hover:border-gray-600"
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div>
                                        <span className="inline-flex px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-sky-500/10 text-sky-400 border border-sky-500/20">
                                          {show.language || 'Language not set'}
                                        </span>
                                        <div className="flex items-center gap-1.5 mt-3 text-sm font-bold text-white">
                                          <Clock className="w-4 h-4 text-[#EF233C]" />
                                          <span>{formatTime(show.startTime)}</span>
                                          <span className="text-xs font-normal text-gray-500">
                                            to {formatTime(show.endTime)}
                                          </span>
                                        </div>
                                      </div>
                                      <Link
                                        to={`/shows/${show.id}/seats`}
                                        className="shrink-0 rounded-lg bg-[#EF233C] px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#DC143C]"
                                      >
                                        Book
                                      </Link>
                                    </div>
                                    <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-800 pt-3 text-[10px] text-gray-400">
                                      <span>Reg <strong className="block text-white">{formatCurrency(show.regularPrice)}</strong></span>
                                      <span>Prem <strong className="block text-amber-400">{formatCurrency(show.premiumPrice)}</strong></span>
                                      <span>Rec <strong className="block text-purple-400">{formatCurrency(show.reclinerPrice)}</strong></span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
