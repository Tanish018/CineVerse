import api from './api';

export const showService = {
  createShow: async (showData) => {
    const res = await api.post('/shows', showData);
    return res.data;
  },

  updateShow: async (id, showData) => {
    const res = await api.put(`/shows/${id}`, showData);
    return res.data;
  },

  getShowById: async (id) => {
    const res = await api.get(`/shows/${id}`);
    return res.data;
  },

  getShowsByScreen: async (screenId) => {
    const res = await api.get(`/shows/screen/${screenId}`);
    return res.data;
  },

  getShowsByScreenAndDate: async (screenId, showDate) => {
    const res = await api.get(`/shows/screen/${screenId}/date/${showDate}`);
    return res.data;
  },

  getShowsByMovie: async (movieId) => {
    const res = await api.get(`/shows/movie/${movieId}`);
    return res.data;
  },

  getShowsByMovieAndDate: async (movieId, showDate) => {
    const res = await api.get(`/shows/movie/${movieId}/date/${showDate}`);
    return res.data;
  },

  deleteShow: async (id) => {
    const res = await api.delete(`/shows/${id}`);
    return res.data;
  },

  searchShows: async (searchParams) => {
    const res = await api.get('/shows/search', { params: searchParams });
    return res.data;
  },

  getSeatsByShow: async (showId) => {
    const res = await api.get(`/shows/${showId}/seats`);
    return res.data;
  },
};
