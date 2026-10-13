import api from './api';

export const bookingService = {
  createBooking: async (bookingData) => {
    const res = await api.post('/bookings', bookingData);
    return res.data;
  },

  getBookingById: async (id) => {
    const res = await api.get(`/bookings/${id}`);
    return res.data;
  },

  getUserBookings: async (userId) => {
    const res = await api.get(`/bookings/user/${userId}/history`);
    return res.data;
  },

  cancelBooking: async (id) => {
    const res = await api.delete(`/bookings/${id}`);
    return res.data;
  },

  getAllBookings: async () => {
    const res = await api.get('/bookings/admin');
    return res.data;
  },

  getBookingsByShow: async (showId) => {
    const res = await api.get(`/bookings/admin/show/${showId}`);
    return res.data;
  },

  searchBookings: async (searchParams) => {
    const res = await api.get('/bookings/admin/search', { params: searchParams });
    return res.data;
  },
};
