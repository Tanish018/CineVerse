import api from './api';

export const screenService = {
  getScreensByTheatre: async (theatreId) => {
    const res = await api.get(`/screens/theatre/${theatreId}`);
    return res.data;
  },

  getScreenById: async (id) => {
    const res = await api.get(`/screens/${id}`);
    return res.data;
  },

  createScreen: async (theatreId, screenData) => {
    const res = await api.post(`/screens/theatre/${theatreId}`, screenData);
    return res.data;
  },

  updateScreen: async (id, screenData) => {
    const res = await api.put(`/screens/${id}`, screenData);
    return res.data;
  },

  deactivateScreen: async (id) => {
    const res = await api.delete(`/screens/${id}`);
    return res.data;
  },
};
