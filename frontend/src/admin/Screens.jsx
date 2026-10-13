import React, { useState, useEffect } from 'react';
import { screenService } from '../services/screenService';
import { theatreService } from '../services/theatreService';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { Tv, Plus, Edit2, Trash2, MapPin, AlertCircle } from 'lucide-react';

const initialScreenForm = {
  theatreId: '',
  screenNumber: 1,
  name: 'Audi 1',
  regularSeats: 70,
  premiumSeats: 20,
  reclinerSeats: 10,
  screenType: 'IMAX 3D',
};

const AdminScreens = () => {
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatreId, setSelectedTheatreId] = useState('');
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingScreen, setEditingScreen] = useState(null);
  const [formData, setFormData] = useState(initialScreenForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const loadTheatres = async () => {
      try {
        const res = await theatreService.getAllTheatres();
        if (res && res.data && res.data.length > 0) {
          setTheatres(res.data);
          setSelectedTheatreId(res.data[0].id.toString());
        }
      } catch (err) {
        console.error('Failed to load theatres:', err);
      }
    };
    loadTheatres();
  }, []);

  const loadScreens = async () => {
    if (!selectedTheatreId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await screenService.getScreensByTheatre(selectedTheatreId);
      if (res && res.data) {
        setScreens(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch screens for this theatre.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScreens();
  }, [selectedTheatreId]);

  const openCreateModal = () => {
    setEditingScreen(null);
    setFormData({
      ...initialScreenForm,
      theatreId: selectedTheatreId,
      screenNumber: screens.length + 1,
      name: `Audi ${screens.length + 1}`,
    });
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (screen) => {
    setEditingScreen(screen);
    setFormData({
      theatreId: screen.theatreId?.toString() || selectedTheatreId,
      screenNumber: screen.screenNumber,
      name: screen.name || '',
      regularSeats: screen.regularSeats || 0,
      premiumSeats: screen.premiumSeats || 0,
      reclinerSeats: screen.reclinerSeats || 0,
      screenType: screen.screenType || 'Standard',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const totalCapacity =
      Number(formData.regularSeats) +
      Number(formData.premiumSeats) +
      Number(formData.reclinerSeats);

    if (totalCapacity < 100) {
      setFormError('Screen capacity must be at least 100 seats (Regular + Premium + Recliner >= 100).');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        screenNumber: Number(formData.screenNumber),
        name: formData.name,
        regularSeats: Number(formData.regularSeats),
        premiumSeats: Number(formData.premiumSeats),
        reclinerSeats: Number(formData.reclinerSeats),
        screenType: formData.screenType,
      };

      if (editingScreen) {
        await screenService.updateScreen(editingScreen.id, payload);
      } else {
        await screenService.createScreen(Number(formData.theatreId), payload);
      }

      setModalOpen(false);
      await loadScreens();
    } catch (err) {
      console.error('Save screen error:', err);
      setFormError(err.response?.data?.message || 'Failed to save screen.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (screenId, screenName) => {
    if (!window.confirm(`Are you sure you want to deactivate "${screenName}"?`)) {
      return;
    }
    try {
      await screenService.deactivateScreen(screenId);
      await loadScreens();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to deactivate screen.');
    }
  };

  const selectedTheatre = theatres.find((t) => t.id.toString() === selectedTheatreId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Tv className="w-6 h-6 text-[#EF233C]" />
            Auditorium Screens
          </h1>
          <p className="text-xs text-gray-400 mt-1">Configure screens, sound specs, and seating capacities per venue</p>
        </div>

        <button
          onClick={openCreateModal}
          disabled={!selectedTheatreId}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#EF233C] to-[#DC143C] hover:from-red-600 hover:to-red-700 disabled:opacity-50 shadow-md shadow-red-500/20"
        >
          <Plus className="w-4 h-4" />
          Add Screen
        </button>
      </div>

      <div className="bg-[#0D1117] border border-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-[#EF233C]" />
          <div>
            <span className="text-[11px] font-semibold uppercase text-gray-500 block">Select Active Theatre</span>
            <span className="text-sm font-bold text-white">
              {selectedTheatre ? `${selectedTheatre.name} (${selectedTheatre.city})` : 'Choose Theatre'}
            </span>
          </div>
        </div>

        <select
          value={selectedTheatreId}
          onChange={(e) => setSelectedTheatreId(e.target.value)}
          className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs text-white focus:outline-none focus:border-[#EF233C]"
        >
          {theatres.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} - {t.city} ({t.numberOfScreens} Screens Max)
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loading message="Loading auditorium screens..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadScreens} />
      ) : (
        <div className="bg-[#0D1117] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-900/60 text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Screen #</th>
                  <th className="py-3.5 px-4 font-semibold">Name</th>
                  <th className="py-3.5 px-4 font-semibold">Format / Type</th>
                  <th className="py-3.5 px-4 font-semibold">Total Capacity</th>
                  <th className="py-3.5 px-4 font-semibold">Regular</th>
                  <th className="py-3.5 px-4 font-semibold">Premium</th>
                  <th className="py-3.5 px-4 font-semibold">Recliner</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {screens.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-gray-500">
                      No screens configured for this theatre venue yet. Click "Add Screen" above.
                    </td>
                  </tr>
                ) : (
                  screens.map((screen) => (
                    <tr key={screen.id} className="hover:bg-gray-800/30">
                      <td className="py-3 px-4 font-bold text-white">#{screen.screenNumber}</td>
                      <td className="py-3 px-4 font-bold text-white">{screen.name}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          {screen.screenType}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-extrabold text-white">{screen.capacity} Seats</td>
                      <td className="py-3 px-4 text-blue-400 font-semibold">{screen.regularSeats}</td>
                      <td className="py-3 px-4 text-amber-400 font-semibold">{screen.premiumSeats}</td>
                      <td className="py-3 px-4 text-purple-400 font-semibold">{screen.reclinerSeats}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(screen)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                            title="Edit Screen"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeactivate(screen.id, screen.name)}
                            className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                            title="Deactivate Screen"
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
        title={editingScreen ? 'Edit Screen Configuration' : 'Add New Screen'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {formError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {!editingScreen && (
            <div>
              <label className="block text-gray-400 uppercase font-semibold mb-1">Target Theatre Venue *</label>
              <select
                value={formData.theatreId}
                onChange={(e) => setFormData({ ...formData, theatreId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#EF233C]"
              >
                {theatres.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.city})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 uppercase font-semibold mb-1">Screen Number *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.screenNumber}
                onChange={(e) => setFormData({ ...formData, screenNumber: parseInt(e.target.value, 10) || 1 })}
                className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#EF233C]"
              />
            </div>

            <div>
              <label className="block text-gray-400 uppercase font-semibold mb-1">Auditorium Name *</label>
              <input
                type="text"
                required
                placeholder="Audi 1 - Laser"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#EF233C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 uppercase font-semibold mb-1">Screen Type / Format *</label>
            <input
              type="text"
              required
              placeholder="IMAX 3D, Dolby Atmos, 4DX, Standard 2D"
              value={formData.screenType}
              onChange={(e) => setFormData({ ...formData, screenType: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#EF233C]"
            />
          </div>

          <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800 space-y-3">
            <div className="flex items-center justify-between text-gray-300 font-semibold">
              <span>Seating Configuration (Min. 100 Seats Required)</span>
              <span className="text-[#EF233C]">
                Total: {Number(formData.regularSeats) + Number(formData.premiumSeats) + Number(formData.reclinerSeats)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-gray-400 text-[10px] uppercase mb-1">Regular Seats *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.regularSeats}
                  onChange={(e) => setFormData({ ...formData, regularSeats: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-white text-xs focus:outline-none focus:border-[#EF233C]"
                />
              </div>

              <div>
                <label className="block text-amber-400 text-[10px] uppercase mb-1">Premium Seats *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.premiumSeats}
                  onChange={(e) => setFormData({ ...formData, premiumSeats: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-white text-xs focus:outline-none focus:border-[#EF233C]"
                />
              </div>

              <div>
                <label className="block text-purple-400 text-[10px] uppercase mb-1">Recliner Seats *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.reclinerSeats}
                  onChange={(e) => setFormData({ ...formData, reclinerSeats: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-white text-xs focus:outline-none focus:border-[#EF233C]"
                />
              </div>
            </div>
            <p className="text-[10px] text-gray-500">
              * Note: Backend automatically generates all physical seat records (A1, A2, etc.) for this screen upon creation.
            </p>
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
              {submitting ? 'Saving...' : editingScreen ? 'Update Screen' : 'Create Screen'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminScreens;
