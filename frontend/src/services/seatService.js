import api from './api';

export const seatService = {
  getSeatsByScreen: async (screenId) => {
    const res = await api.get(`/seats/screen/${screenId}`);
    return res.data;
  },
};
