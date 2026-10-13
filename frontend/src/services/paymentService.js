import api from './api';

export const paymentService = {
  createCheckoutSession: async (bookingId) => {
    const res = await api.post('/payments/checkout', { bookingId });
    return res.data;
  },
};
