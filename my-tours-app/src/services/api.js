import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082',
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Tour API endpoints
export const tourAPI = {
  getAllTours: () => api.get('/api/tours'),
  getTourById: (id) => api.get(`/api/tours/${id}`),
  createTour: (tourData) => api.post('/api/admin/tours', tourData),
  updateTour: (id, tourData) => api.put(`/api/admin/tours/${id}`, tourData),
  deleteTour: (id) => api.delete(`/api/admin/tours/${id}`),
  activateTour: (id) => api.put(`/api/tours/${id}/activate`),
  deactivateTour: (id) => api.put(`/api/tours/${id}/deactivate`),
  getToursByCategory: (category) => api.get(`/api/tours/category/${category}`),
  searchTours: (query) => api.get(`/api/tours/search?query=${query}`),
  getTopRatedTours: () => api.get('/api/tours/top-rated'),
  getLatestTours: () => api.get('/api/tours/latest'),
};

// Booking API endpoints
export const bookingAPI = {
  getAllBookings: () => api.get('/api/admin/bookings'),
  getBookingById: (id) => api.get(`/api/bookings/${id}`),
  getUserBookings: (userId) => api.get(`/api/bookings/user/${userId}`),
  getCurrentUserBookings: () => api.get('/api/bookings/my-bookings'),
  createBooking: (bookingData) => api.post('/api/bookings', bookingData),
  updateBookingStatus: (id, status) => api.put(`/api/bookings/${id}/status?status=${status}`),
  updatePaymentStatus: (id, paymentStatus) => api.put(`/api/bookings/${id}/payment-status?paymentStatus=${paymentStatus}`),
  deleteBooking: (id) => api.delete(`/api/bookings/${id}`),
  getBookingsByStatus: (status) => api.get(`/api/bookings/status/${status}`),
  getBookingsByPaymentStatus: (paymentStatus) => api.get(`/api/bookings/payment-status/${paymentStatus}`),
  getConfirmedBookingsCount: () => api.get('/api/bookings/stats/confirmed-count'),
  getTotalRevenue: () => api.get('/api/bookings/stats/total-revenue'),
};

// User API endpoints
export const userAPI = {
  getAllUsers: () => api.get('/api/admin/users'),
  getActiveUsers: () => api.get('/api/admin/users/active'),
  getUserById: (id) => api.get(`/api/admin/users/${id}`),
  updateUser: (id, userData) => api.put(`/api/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
  activateUser: (id) => api.put(`/api/admin/users/${id}/activate`),
  deactivateUser: (id) => api.put(`/api/admin/users/${id}/deactivate`),
  searchUsers: (searchTerm) => api.get(`/api/admin/users/search?searchTerm=${searchTerm}`),
  updateProfile: (profileData) => api.put('/api/user/profile'),
  getCurrentUser: () => api.get('/api/user/me'),
  getTotalUserCount: () => api.get('/api/admin/dashboard/stats'),
};

// Admin Dashboard API endpoints
export const adminAPI = {
  getDashboardStats: () => api.get('/api/admin/dashboard/stats'),
};

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  refreshToken: () => api.post('/api/auth/refresh'),
};

// Wishlist API endpoints
export const wishlistAPI = {
  getMyWishlist: () => api.get('/api/wishlist/my-wishlist'),
  addToWishlist: (tourId) => api.post(`/api/wishlist/add-current?tourId=${tourId}`),
  removeFromWishlist: (tourId) => api.delete(`/api/wishlist/remove-current?tourId=${tourId}`),
};

// Review API endpoints
export const reviewAPI = {
  getCurrentUserReviews: () => api.get('/api/reviews/my-reviews'),
  createReview: (reviewData) => api.post('/api/reviews', reviewData),
  updateReview: (id, reviewData) => api.put(`/api/reviews/${id}`, reviewData),
  deleteReview: (id) => api.delete(`/api/reviews/${id}`),
  getAllReviews: () => api.get('/api/reviews'),
  getReviewsByTour: (tourId) => api.get(`/api/reviews/tour/${tourId}`),
};

// Legacy API functions for backward compatibility
export const getMyWishlist = async () => {
  const response = await api.get('/api/wishlist/my-wishlist');
  return response.data;
};

export const addToWishlistCurrent = async (tourId) => {
  const response = await api.post(`/api/wishlist/add-current?tourId=${tourId}`);
  return response.data;
};

export const removeFromWishlistCurrent = async (tourId) => {
  const response = await api.delete(`/api/wishlist/remove-current?tourId=${tourId}`);
  return response.data;
};

export const getCurrentUserReviews = async () => {
  const response = await api.get('/api/reviews/my-reviews');
  return response.data;
};

export const createReview = async (reviewData) => {
  const response = await api.post('/api/reviews', reviewData);
  return response.data;
};

export const updateReview = async (id, reviewData) => {
  const response = await api.put(`/api/reviews/${id}`, reviewData);
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await api.delete(`/api/reviews/${id}`);
  return response.data;
};

export const getAllTours = async () => {
  const response = await api.get('/api/tours');
  return response.data;
};

export const getTourById = async (id) => {
  const response = await api.get(`/api/tours/${id}`);
  return response.data;
};

export const createTour = async (tourData) => {
  const response = await api.post('/api/admin/tours', tourData);
  return response.data;
};

export const updateTour = async (id, tourData) => {
  const response = await api.put(`/api/admin/tours/${id}`, tourData);
  return response.data;
};

export const deleteTour = async (id) => {
  const response = await api.delete(`/api/admin/tours/${id}`);
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await api.post('/api/bookings', bookingData);
  return response.data;
};

export const deleteBooking = async (id) => {
  const response = await api.delete(`/api/bookings/${id}`);
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await api.put('/api/user/profile', profileData);
  return response.data;
};

export const loginUser = async (loginData) => {
  const response = await api.post('/api/auth/login', loginData);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

export default api;
