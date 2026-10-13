import React, { useState, useEffect } from 'react';
import { theatreService } from '../services/theatreService';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { Compass, Plus, Edit2, Trash2, Search, MapPin } from 'lucide-react';

const initialTheatreForm = {
  name: '',
  city: '',
  address: '',
  numberOfScreens: 1,
  pincode: '',
};

const AdminTheatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTheatre, setEditingTheatre] = useState(null);
  const [formData, setFormData] = useState(initialTheatreForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const loadTheatres = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await theatreService.getAllTheatres();
      if (res && res.data) {
        setTheatres(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch theatres');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTheatres();
  }, []);

  const openCreateModal = () => {
    setEditingTheatre(null);
    setFormData(initialTheatreForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (theatre) => {
    setEditingTheatre(theatre);
    setFormData({
      name: theatre.name || '',
      city: theatre.city || '',
      address: theatre.address || '',
      numberOfScreens: theatre.numberOfScreens || 1,
      pincode: theatre.pincode || '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name || !formData.city || !formData.address || !formData.numberOfScreens) {
      setFormError('Please fill in all mandatory fields.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingTheatre) {
        await theatreService.updateTheatre(editingTheatre.id, formData);
      } else {
        await theatreService.createTheatre(formData);
      }
      setModalOpen(false);
      await loadTheatres();
    } catch (err) {
      console.error('Save theatre error:', err);
      setFormError(err.response?.data?.message || 'Failed to save theatre.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (theatreId, name) => {
    if (!window.confirm(`Are you sure you want to deactivate theatre "${name}"?`)) {
      return;
    }
    try {
      await theatreService.deleteTheatre(theatreId);
      await loadTheatres();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete theatre.');
    }
  };

  const filteredTheatres = theatres.filter((t) =>
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.city?.toLowerCase().includes(search.toLowerCase()) ||
    t.address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Compass className="w-6 h-6 text-[#EF233C]" />
            Theatre Venues
          </h1>
          <p className="text-xs text-gray-400 mt-1">Manage cinema multiplex locations and screen capacities</p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#EF233C] to-[#DC143C] hover:from-red-600 hover:to-red-700 shadow-md shadow-red-500/20"
        >
          <Plus className="w-4 h-4" />
          Add Theatre
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by name, city, address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0D1117] border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#EF233C]"
        />
      </div>

      {loading ? (
        <Loading message="Loading theatres..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadTheatres} />
      ) : (
        <div className="bg-[#0D1117] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-900/60 text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">ID</th>
                  <th className="py-3.5 px-4 font-semibold">Venue Name</th>
                  <th className="py-3.5 px-4 font-semibold">City</th>
                  <th className="py-3.5 px-4 font-semibold">Address</th>
                  <th className="py-3.5 px-4 font-semibold">Screens</th>
                  <th className="py-3.5 px-4 font-semibold">Pincode</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {filteredTheatres.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">
                      No theatres found.
                    </td>
                  </tr>
                ) : (
                  filteredTheatres.map((theatre) => (
                    <tr key={theatre.id} className="hover:bg-gray-800/30">
                      <td className="py-3 px-4 font-semibold text-gray-400">#{theatre.id}</td>
                      <td className="py-3 px-4 font-bold text-white">{theatre.name}</td>
                      <td className="py-3 px-4 text-gray-300">
                        <span className="px-2 py-0.5 rounded bg-gray-800 text-[10px] text-gray-300">
                          {theatre.city}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 max-w-[200px] truncate">{theatre.address}</td>
                      <td className="py-3 px-4 font-semibold text-white">{theatre.numberOfScreens} Screens</td>
                      <td className="py-3 px-4 text-gray-400">{theatre.pincode || '—'}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(theatre)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                            title="Edit Theatre"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(theatre.id, theatre.name)}
                            className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                            title="Delete Theatre"
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
        title={editingTheatre ? 'Edit Theatre' : 'Add New Theatre'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {formError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-gray-400 uppercase font-semibold mb-1">Theatre Name *</label>
            <input
              type="text"
              required
              placeholder="MovieVerse IMAX Central"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#EF233C]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 uppercase font-semibold mb-1">City *</label>
              <input
                type="text"
                required
                placeholder="Mumbai"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#EF233C]"
              />
            </div>

            <div>
              <label className="block text-gray-400 uppercase font-semibold mb-1">Number of Screens *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.numberOfScreens}
                onChange={(e) => setFormData({ ...formData, numberOfScreens: parseInt(e.target.value, 10) || 1 })}
                className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#EF233C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 uppercase font-semibold mb-1">Street Address *</label>
            <input
              type="text"
              required
              placeholder="Mall Avenue, 4th Floor"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#EF233C]"
            />
          </div>

          <div>
            <label className="block text-gray-400 uppercase font-semibold mb-1">Pincode</label>
            <input
              type="text"
              placeholder="400001"
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#EF233C]"
            />
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
              {submitting ? 'Saving...' : editingTheatre ? 'Update Theatre' : 'Create Theatre'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminTheatres;
