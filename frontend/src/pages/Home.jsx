import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, ShieldCheck, Sparkles, Ticket, QrCode } from 'lucide-react';
import { movieService } from '../services/movieService';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { formatDuration } from '../utils/formatters';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await movieService.getAllMovies();
      setMovies(response?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to connect to cinema servers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (movies.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % Math.min(movies.length, 5));
    }, 7000);
    return () => window.clearInterval(timer);
  }, [movies.length]);

  const featuredMovies = movies.slice(0, 5);
  const featuredMovie = featuredMovies[activeIndex] || movies[0];
  const heroImage = featuredMovie?.heroImageUrl || featuredMovie?.posterUrl;
  const changeSlide = (direction) => {
    setActiveIndex((index) => (index + direction + featuredMovies.length) % featuredMovies.length);
  };

  return (
    <div className="min-h-screen bg-[#070b12]">
      {loading ? (
        <Loading message="Preparing tonight's screenings..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : (
        <>
          <section className="relative isolate w-full min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] overflow-hidden border-b border-white/5 flex items-center">
            {heroImage && (
              <img
                key={heroImage}
                src={heroImage}
                alt={featuredMovie?.title || ''}
                className="absolute inset-0 h-full w-full object-cover object-center animate-[hero-reveal_700ms_ease-out]"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-[#070b12] via-[#070b12]/85 to-transparent z-[1]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b12] via-transparent to-black/30 z-[1]" />

            <button
              type="button"
              onClick={() => changeSlide(-1)}
              aria-label="Previous featured movie"
              className="absolute left-3 sm:left-5 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/15 bg-black/50 p-2.5 text-white backdrop-blur-md transition-all duration-200 hover:bg-[#EF233C] hover:border-[#EF233C] hover:scale-105 sm:block shadow-lg"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => changeSlide(1)}
              aria-label="Next featured movie"
              className="absolute right-3 sm:right-5 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/15 bg-black/50 p-2.5 text-white backdrop-blur-md transition-all duration-200 hover:bg-[#EF233C] hover:border-[#EF233C] hover:scale-105 sm:block shadow-lg"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 py-14 sm:py-16">
              <div className="max-w-xl">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-gray-300">
                  Now in Theatres
                </p>

                <h1 className="mb-3 text-4xl sm:text-6xl lg:text-7xl font-black uppercase leading-[0.95] tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                  {featuredMovie?.title || 'Your next great story'}
                </h1>

                {featuredMovie && (
                  <div className="mb-3.5 flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-gray-300">
                    {featuredMovie.durationMinutes ? (
                      <span>{formatDuration(featuredMovie.durationMinutes)}</span>
                    ) : null}
                    {featuredMovie.durationMinutes && featuredMovie.genre ? (
                      <span className="text-gray-500">|</span>
                    ) : null}
                    {featuredMovie.genre ? <span>{featuredMovie.genre}</span> : null}
                    {(featuredMovie.genre || featuredMovie.durationMinutes) && (
                      <span className="text-gray-500">|</span>
                    )}
                    <span>{featuredMovie.language || 'English'}</span>
                  </div>
                )}

                <p className="mb-6 max-w-lg text-xs sm:text-sm leading-relaxed text-gray-300 drop-shadow">
                  {featuredMovie?.description || 'Find your seat, settle in, and let the screen take over.'}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to={featuredMovie ? `/movies/${featuredMovie.id}` : '/movies'}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#EF233C] to-[#DC143C] px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-red-600/30 transition-all hover:scale-105 active:scale-95"
                  >
                    <Ticket className="h-4 w-4" /> Book Tickets
                  </Link>
                  <Link
                    to={featuredMovie ? `/movies/${featuredMovie.id}` : '/movies'}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-black/40 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/40 hover:scale-105 active:scale-95"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" /> Watch Trailer
                  </Link>
                </div>
              </div>
            </div>

            {featuredMovies.length > 1 && (
              <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                {featuredMovies.map((movie, index) => (
                  <button
                    key={movie.id}
                    type="button"
                    aria-label={`Show ${movie.title}`}
                    onClick={() => setActiveIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? 'w-7 bg-[#EF233C] shadow-sm shadow-red-500/50'
                        : 'w-5 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            )}
          </section>

          <main className="mx-auto max-w-7xl px-5 pt-10 pb-0 sm:px-8 sm:pt-14 sm:pb-0">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#EF233C]">
                  On the big screen
                </p>
                <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Now Showing</h2>
              </div>
              <Link
                to="/movies"
                className="flex items-center gap-1 text-xs font-semibold text-[#EF233C] hover:text-white transition-colors"
              >
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {movies.length === 0 ? (
              <div className="rounded-xl border border-white/5 bg-[#101a2b] py-16 text-center text-sm text-gray-400">
                No movies are currently scheduled.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
                {movies.slice(0, 6).map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </main>

          <section className="relative w-full border-y border-white/5 bg-gradient-to-b from-[#0a1120] via-[#0d1627] to-[#070b14] py-10 sm:py-12 mt-6 overflow-hidden">
            <div className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-red-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-5 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:border-red-500/30 hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-xl hover:shadow-red-500/5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-[#EF233C] transition-transform duration-300 group-hover:scale-110 shadow-sm shadow-red-500/10">
                      <Ticket className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#EF233C] transition-colors">
                        Easy Booking
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">Book in just a few clicks</p>
                    </div>
                  </div>
                </div>

                <div className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-5 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:border-amber-500/30 hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 transition-transform duration-300 group-hover:scale-110 shadow-sm shadow-amber-500/10">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                        Best Seats
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">Choose your favourite view</p>
                    </div>
                  </div>
                </div>

                <div className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-5 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/30 hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 transition-transform duration-300 group-hover:scale-110 shadow-sm shadow-emerald-500/10">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                        Secure Payments
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">100% safe and secure</p>
                    </div>
                  </div>
                </div>

                <div className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-5 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:border-sky-500/30 hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 transition-transform duration-300 group-hover:scale-110 shadow-sm shadow-sky-500/10">
                      <QrCode className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-sky-400 transition-colors">
                        Instant E-Tickets
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">Fast digital entry at gate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
