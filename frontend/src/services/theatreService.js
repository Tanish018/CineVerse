import api from './api';

export const theatreService = {
  getAllTheatres: async (city = null) => {
    const params = city ? { city } : {};
    const res = await api.get('/theatres', { params });
    return res.data;
  },

  getTheatreById: async (id) => {
    const res = await api.get(`/theatres/${id}`);
    return res.data;
  },

  createTheatre: async (theatreData) => {
    const res = await api.post('/theatres', theatreData);
    return res.data;
  },

  updateTheatre: async (id, theatreData) => {
    const res = await api.put(`/theatres/${id}`, theatreData);
    return res.data;
  },

  deleteTheatre: async (id) => {
    const res = await api.delete(`/theatres/${id}`);
    return res.data;
  },
};
