import React, { useState, useEffect } from 'react';
import { showService } from '../services/showService';
import { movieService } from '../services/movieService';
import { theatreService } from '../services/theatreService';
import { screenService } from '../services/screenService';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { Calendar, Plus, Edit2, Trash2, Clock, MapPin, Tv, Film } from 'lucide-react';
import { formatTime, formatDate, formatCurrency } from '../utils/formatters';

const initialShowForm = {
  movieId: '',
  language: '',
  theatreId: '',
  screenId: '',
  showDate: new Date().toISOString().split('T')[0],
  startTime: '14:00',
  endTime: '16:30',
  regularPrice: 200,
  premiumPrice: 350,
  reclinerPrice: 500,
};

const getMovieLanguages = (movie) => {
  if (!movie || !movie.language) return [];
  return movie.language
    .split(',')
    .map((l) => l.trim())
    .filter(Boolean);
};

const AdminShows = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [formData, setFormData] = useState(initialShowForm);
  const [modalScreens, setModalScreens] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [mRes, tRes] = await Promise.all([
        movieService.getAllMovies().catch(() => ({ data: [] })),
        theatreService.getAllTheatres().catch(() => ({ data: [] })),
      ]);

      const moviesList = mRes.data || [];
      const theatresList = tRes.data || [];
      setMovies(moviesList);
      setTheatres(theatresList);

      if (moviesList.length > 0) {
        const sRes = await showService.getShowsByMovie(moviesList[0].id).catch(() => ({ data: [] }));
        setShows(sRes.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch shows data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const fetchScreensForModal = async () => {
      if (!formData.theatreId) {
        setModalScreens([]);
        return;
      }
      try {
        const res = await screenService.getScreensByTheatre(formData.theatreId);
        if (res && res.data) {
          setModalScreens(res.data);
          if (res.data.length > 0 && !formData.screenId) {
            setFormData((prev) => ({ ...prev, screenId: res.data[0].id.toString() }));
          }
        }
      } catch (err) {
        console.error('Failed to load screens:', err);
      }
    };

    fetchScreensForModal();
  }, [formData.theatreId]);

  const openCreateModal = () => {
    setEditingShow(null);
    const defaultMovie = movies[0];
    const defaultMovieId = defaultMovie?.id?.toString() || '';
    const defaultTheatreId = theatres[0]?.id?.toString() || '';
    const defaultLanguages = getMovieLanguages(defaultMovie);
    setFormData({
      ...initialShowForm,
      movieId: defaultMovieId,
      language: defaultLanguages[0] || '',
      theatreId: defaultTheatreId,
    });
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (show) => {
    setEditingShow(show);
    const movie = movies.find((m) => m.id === show.movieId);
    const movieLanguages = getMovieLanguages(movie);
    setFormData({
      movieId: show.movieId?.toString() || '',
      language: show.language || movieLanguages[0] || '',
      theatreId: '',
      screenId: show.screenId?.toString() || '',
      showDate: show.showDate || new Date().toISOString().split('T')[0],
      startTime: show.startTime?.substring(0, 5) || '14:00',
      endTime: show.endTime?.substring(0, 5) || '16:30',
      regularPrice: show.regularPrice || 200,
      premiumPrice: show.premiumPrice || 350,
      reclinerPrice: show.reclinerPrice || 500,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.movieId || !formData.language.trim() || !formData.screenId || !formData.showDate || !formData.startTime || !formData.endTime) {
      setFormError('Please fill in all mandatory show information.');
      return;
    }

    setSubmitting(true);
    try {
      const formatTimeWithSeconds = (t) => (t.length === 5 ? `${t}:00` : t);

      const payload = {
        movieId: Number(formData.movieId),
        language: formData.language.trim(),
        screenId: Number(formData.screenId),
        showDate: formData.showDate,
        startTime: formatTimeWithSeconds(formData.startTime),
        endTime: formatTimeWithSeconds(formData.endTime),
        regularPrice: Number(formData.regularPrice),
        premiumPrice: Number(formData.premiumPrice),
        reclinerPrice: Number(formData.reclinerPrice),
      };

      if (editingShow) {
        await showService.updateShow(editingShow.id, payload);
      } else {
        await showService.createShow(payload);
      }

      setModalOpen(false);
      if (formData.movieId) {
        const res = await showService.getShowsByMovie(formData.movieId);
        setShows(res.data || []);
      }
    } catch (err) {
      console.error('Save show error:', err);
      setFormError(err.response?.data?.message || 'Failed to save showtime.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (showId) => {
    if (!window.confirm('Are you sure you want to remove this scheduled screening?')) {
      return;
    }
    try {
      await showService.deleteShow(showId);
      setShows(shows.filter((s) => s.id !== showId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete show.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#EF233C]" />
            Show Schedule Management
          </h1>
          <p className="text-xs text-gray-400 mt-1">Schedule theatrical showtimes and configure dynamic ticket tier pricing</p>
        </div>

        <button
          onClick={openCreateModal}
          disabled={movies.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#EF233C] to-[#DC143C] hover:from-red-600 hover:to-red-700 disabled:opacity-50 shadow-md shadow-red-500/20"
        >
          <Plus className="w-4 h-4" />
          Schedule Show
        </button>
      </div>

      {loading ? (
        <Loading message="Loading showtimes..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadInitialData} />
      ) : (
        <div className="bg-[#0D1117] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-900/60 text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Show ID</th>
                  <th className="py-3.5 px-4 font-semibold">Movie</th>
                  <th className="py-3.5 px-4 font-semibold">Language</th>
                  <th className="py-3.5 px-4 font-semibold">Screen ID</th>
                  <th className="py-3.5 px-4 font-semibold">Date</th>
                  <th className="py-3.5 px-4 font-semibold">Timing</th>
                  <th className="py-3.5 px-4 font-semibold">Pricing (Reg / Prem / Rec)</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {shows.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-gray-500">
                      No shows scheduled. Click "Schedule Show" to create a new session.
                    </td>
                  </tr>
                ) : (
                  shows.map((show) => {
                    const movie = movies.find((m) => m.id === show.movieId);

                    return (
                      <tr key={show.id} className="hover:bg-gray-800/30">
                        <td className="py-3 px-4 font-bold text-white">#{show.id}</td>
                        <td className="py-3 px-4 font-bold text-white max-w-[180px] truncate">
                          {movie?.title || `Movie #${show.movieId}`}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {show.language ? (
                            <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-semibold">
                              {show.language}
                            </span>
                          ) : (
                            <span className="text-gray-500">Not set</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-300">Screen #{show.screenId}</td>
                        <td className="py-3 px-4 text-gray-300">{formatDate(show.showDate)}</td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-white">{formatTime(show.startTime)}</span>
                          <span className="text-gray-500 ml-1">to {formatTime(show.endTime)}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-300 font-medium">
                          {formatCurrency(show.regularPrice)} / {formatCurrency(show.premiumPrice)} /{' '}
                          {formatCurrency(show.reclinerPrice)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(show)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                              title="Edit Show"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(show.id)}
                              className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                              title="Delete Show"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingShow ? 'Edit Show Details' : 'Schedule New Screening'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {formError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-gray-400 uppercase font-semibold mb-1">Select Movie *</label>
            <select
              value={formData.movieId}
              onChange={(e) => {
                const newId = e.target.value;
                const selectedMovie = movies.find((movie) => movie.id.toString() === newId);
                const langs = getMovieLanguages(selectedMovie);
                const nextLang = langs.includes(formData.language) ? formData.language : (langs[0] || '');
                setFormData((prev) => ({
                  ...prev,
                  movieId: newId,
                  language: nextLang,
                }));
              }}
              required
              className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#EF233C]"
            >
              {movies.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title} {m.language ? `(${m.language})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-400 uppercase font-semibold mb-1">Show Language *</label>
            {(() => {
              const currentMovie = movies.find((m) => m.id.toString() === formData.movieId?.toString());
              const availableLanguages = getMovieLanguages(currentMovie);

              if (availableLanguages.length > 0) {
                return (
                  <select
                    required
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#EF233C]"
                  >
                    <option value="" disabled>Select language...</option>
                    {formData.language && !availableLanguages.includes(formData.language) && (
                      <option value={formData.language}>{formData.language} (Custom / Previous)</option>
                    )}
                    {availableLanguages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                );
              }

              return (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    required
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    placeholder="e.g. English"
                    className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#EF233C]"
                  />
                  <p className="text-[10px] text-amber-400/90">
                    No languages configured for this movie. You can type one here or configure languages in Movie Catalogue.
                  </p>
                </div>
              );
            })()}
            <p className="mt-1 text-[10px] text-gray-500">Choose from the available languages of the selected movie.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 uppercase font-semibold mb-1">Select Theatre *</label>
              <select
                value={formData.theatreId}
                onChange={(e) => setFormData({ ...formData, theatreId: e.target.value, screenId: '' })}
                className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#EF233C]"
              >
                {theatres.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-400 uppercase font-semibold mb-1">Select Screen *</label>
              <select
                value={formData.screenId}
                onChange={(e) => setFormData({ ...formData, screenId: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#EF233C]"
              >
                {modalScreens.length === 0 ? (
                  <option value="">No screens in this theatre</option>
                ) : (
                  modalScreens.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (#{s.screenNumber}) - {s.screenType}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-400 uppercase font-semibold mb-1">Date *</label>
              <input
                type="date"
                required
                value={formData.showDate}
                onChange={(e) => setFormData({ ...formData, showDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#EF233C]"
              />
            </div>

            <div>
              <label className="block text-gray-400 uppercase font-semibold mb-1">Start Time *</label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#EF233C]"
              />
            </div>

            <div>
              <label className="block text-gray-400 uppercase font-semibold mb-1">End Time *</label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#EF233C]"
              />
            </div>
          </div>

          <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800 space-y-3">
            <span className="block font-semibold text-gray-300">Ticket Tier Pricing (INR)</span>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-blue-400 text-[10px] uppercase mb-1">Regular (₹) *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.regularPrice}
                  onChange={(e) => setFormData({ ...formData, regularPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-white text-xs focus:outline-none focus:border-[#EF233C]"
                />
              </div>

              <div>
                <label className="block text-amber-400 text-[10px] uppercase mb-1">Premium (₹) *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.premiumPrice}
                  onChange={(e) => setFormData({ ...formData, premiumPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-white text-xs focus:outline-none focus:border-[#EF233C]"
                />
              </div>

              <div>
                <label className="block text-purple-400 text-[10px] uppercase mb-1">Recliner (₹) *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.reclinerPrice}
                  onChange={(e) => setFormData({ ...formData, reclinerPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-white text-xs focus:outline-none focus:border-[#EF233C]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#EF233C] to-[#DC143C] hover:from-red-600 hover:to-red-700 shadow-md shadow-red-500/20 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : editingShow ? 'Update Show' : 'Schedule Show'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminShows;
