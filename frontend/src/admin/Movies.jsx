import React, { useState, useEffect } from 'react';
import { movieService } from '../services/movieService';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { Film, Plus, Edit2, Trash2, Search, X, Check, Clock, Calendar } from 'lucide-react';
import { formatDuration, formatDate } from '../utils/formatters';

const initialMovieForm = {
  title: '',
  description: '',
  genre: '',
  language: '',
  durationMinutes: 120,
  releaseDate: new Date().toISOString().split('T')[0],
  posterUrl: '',
  heroImageUrl: '',
};

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState(initialMovieForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const loadMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await movieService.getAllMovies();
      if (res && res.data) {
        setMovies(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const openCreateModal = () => {
    setEditingMovie(null);
    setFormData(initialMovieForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = async (movie) => {
    let latestMovie = movie;
    try {
      const response = await movieService.getMovieById(movie.id);
      latestMovie = response?.data || movie;
    } catch (err) {
      console.error('Failed to load latest movie details:', err);
    }

    setEditingMovie(latestMovie);
    setFormData({
      title: latestMovie.title || '',
      description: latestMovie.description || '',
      genre: latestMovie.genre || '',
      language: latestMovie.language || '',
      durationMinutes: latestMovie.durationMinutes || 120,
      releaseDate: latestMovie.releaseDate || new Date().toISOString().split('T')[0],
      posterUrl: latestMovie.posterUrl || '',
      heroImageUrl: latestMovie.heroImageUrl || '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title || !formData.genre || !formData.language || !formData.durationMinutes || !formData.releaseDate) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const formattedLanguages = formData.language
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean)
        .join(', ');

      const payload = {
        ...formData,
        language: formattedLanguages,
      };

      if (editingMovie) {
        const response = await movieService.updateMovie(editingMovie.id, payload);
        if (response?.data) {
          setMovies((currentMovies) =>
            currentMovies.map((movie) => (
              movie.id === editingMovie.id ? response.data : movie
            ))
          );
        }
      } else {
        await movieService.createMovie(payload);
        await loadMovies();
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Movie save error:', err);
      setFormError(err.response?.data?.message || 'Failed to save movie details.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (movieId, movieTitle) => {
    if (!window.confirm(`Are you sure you want to deactivate "${movieTitle}"?`)) {
      return;
    }
    try {
      await movieService.deleteMovie(movieId);
      await loadMovies();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete movie.');
    }
  };

  const filteredMovies = movies.filter((m) =>
    m.title?.toLowerCase().includes(search.toLowerCase()) ||
    m.genre?.toLowerCase().includes(search.toLowerCase()) ||
    m.language?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Film className="w-6 h-6 text-[#EF233C]" />
            Movie Catalogue Management
          </h1>
          <p className="text-xs text-gray-400 mt-1">Add, update, and manage theatrical releases</p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#EF233C] to-[#DC143C] hover:from-red-600 hover:to-red-700 shadow-md shadow-red-500/20"
        >
          <Plus className="w-4 h-4" />
          Add Movie
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter movies by title, genre, language..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0D1117] border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#EF233C]"
        />
      </div>

      {loading ? (
        <Loading message="Loading movies..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadMovies} />
      ) : (
        <div className="bg-[#0D1117] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-900/60 text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Poster</th>
                  <th className="py-3.5 px-4 font-semibold">Title</th>
                  <th className="py-3.5 px-4 font-semibold">Genre</th>
                  <th className="py-3.5 px-4 font-semibold">Language</th>
                  <th className="py-3.5 px-4 font-semibold">Duration</th>
                  <th className="py-3.5 px-4 font-semibold">Release Date</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {filteredMovies.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">
                      No movies found in this view.
                    </td>
                  </tr>
                ) : (
                  filteredMovies.map((movie) => (
                    <tr key={movie.id} className="hover:bg-gray-800/30">
                      <td className="py-2.5 px-4">
                        <div className="w-10 h-14 rounded-lg overflow-hidden bg-gray-900 border border-gray-800 shrink-0">
                          {movie.posterUrl ? (
                            <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                              <Film className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-4 font-bold text-white max-w-[200px] truncate">
                        {movie.title}
                      </td>
                      <td className="py-2.5 px-4 text-gray-300">
                        <span className="px-2 py-0.5 rounded bg-gray-800 text-[10px] text-gray-300">
                          {movie.genre}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-gray-300">
                        <div className="flex flex-wrap gap-1">
                          {movie.language ? (
                            movie.language.split(',').map((lang) => (
                              <span
                                key={lang.trim()}
                                className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-medium"
                              >
                                {lang.trim()}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500">Not set</span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-gray-400">{formatDuration(movie.durationMinutes)}</td>
                      <td className="py-2.5 px-4 text-gray-400">{formatDate(movie.releaseDate)}</td>
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(movie)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                            title="Edit Movie"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(movie.id, movie.title)}
                            className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                            title="Deactivate Movie"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingMovie ? 'Edit Movie Details' : 'Add New Movie'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {formError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-gray-400 uppercase font-semibold mb-1">Movie Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#EF233C]"
            />
          </div>

          <div>
            <label className="block text-gray-400 uppercase font-semibold mb-1">Description / Synopsis</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#EF233C]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 uppercase font-semibold mb-1">Genre *</label>
              <input
                type="text"
                placeholder="Action, Sci-Fi"
                required
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#EF233C]"
              />
            </div>

            <div>
              <label className="block text-gray-400 uppercase font-semibold mb-1">Language(s) *</label>
              <input
                type="text"
                placeholder="e.g. English, Hindi, Telugu"
                required
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#EF233C]"
              />
              <p className="mt-1 text-[10px] text-gray-400">
                Separate multiple languages with commas (e.g. English, Hindi, Telugu). They will be selectable when creating shows.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 uppercase font-semibold mb-1">Duration (Minutes) *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#EF233C]"
              />
            </div>

            <div>
              <label className="block text-gray-400 uppercase font-semibold mb-1">Release Date *</label>
              <input
                type="date"
                required
                value={formData.releaseDate}
                onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#EF233C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 uppercase font-semibold mb-1">Poster Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.posterUrl}
              onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#EF233C]"
            />
          </div>

          <div>
            <label className="block text-gray-400 uppercase font-semibold mb-1">Hero Image URL</label>
            <input
              type="url"
              placeholder="Wide cinematic image for the home hero"
              value={formData.heroImageUrl}
              onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#EF233C]"
            />
            <p className="mt-1.5 text-[10px] text-gray-500">Use a wide landscape image. The poster remains the fallback when this is empty.</p>
            {formData.heroImageUrl && <img src={formData.heroImageUrl} alt="Hero preview" className="mt-3 h-24 w-full rounded-lg object-cover border border-gray-800" />}
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
              {submitting ? 'Saving...' : editingMovie ? 'Update Movie' : 'Create Movie'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminMovies;
