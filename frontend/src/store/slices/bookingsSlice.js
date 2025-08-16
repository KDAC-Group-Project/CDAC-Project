import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookingAPI } from '../../services/api';

// Async thunks
export const fetchAllBookings = createAsyncThunk(
  'bookings/fetchAllBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.getAllBookings();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const fetchUserBookings = createAsyncThunk(
  'bookings/fetchUserBookings',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.getUserBookings(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user bookings');
    }
  }
);

export const fetchCurrentUserBookings = createAsyncThunk(
  'bookings/fetchCurrentUserBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.getCurrentUserBookings();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch current user bookings');
    }
  }
);

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.createBooking(bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create booking');
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  'bookings/updateBookingStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.updateBookingStatus(id, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update booking status');
    }
  }
);

export const updatePaymentStatus = createAsyncThunk(
  'bookings/updatePaymentStatus',
  async ({ id, paymentStatus }, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.updatePaymentStatus(id, paymentStatus);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update payment status');
    }
  }
);

export const deleteBooking = createAsyncThunk(
  'bookings/deleteBooking',
  async (id, { rejectWithValue }) => {
    try {
      await bookingAPI.deleteBooking(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete booking');
    }
  }
);

export const fetchBookingStats = createAsyncThunk(
  'bookings/fetchBookingStats',
  async (_, { rejectWithValue }) => {
    try {
      const [confirmedCount, totalRevenue] = await Promise.all([
        bookingAPI.getConfirmedBookingsCount(),
        bookingAPI.getTotalRevenue()
      ]);
      return {
        confirmedCount: confirmedCount.data,
        totalRevenue: totalRevenue.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch booking stats');
    }
  }
);

const initialState = {
  bookings: [],
  currentUserBookings: [],
  loading: false,
  error: null,
  stats: {
    confirmedCount: 0,
    totalRevenue: 0
  }
};

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearBookings: (state) => {
      state.bookings = [];
      state.currentUserBookings = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all bookings
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
        state.error = null;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch user bookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUserBookings = action.payload;
        state.error = null;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch current user bookings
      .addCase(fetchCurrentUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUserBookings = action.payload;
        state.error = null;
      })
      .addCase(fetchCurrentUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create booking
      .addCase(createBooking.fulfilled, (state, action) => {
        state.currentUserBookings.push(action.payload);
        // Also add to admin bookings if it's not already there
        const existingIndex = state.bookings.findIndex(b => b.id === action.payload.id);
        if (existingIndex === -1) {
          state.bookings.push(action.payload);
        }
      })
      
      // Update booking status
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const updatedBooking = action.payload;
        // Update in admin bookings
        const adminIndex = state.bookings.findIndex(b => b.id === updatedBooking.id);
        if (adminIndex !== -1) {
          state.bookings[adminIndex] = updatedBooking;
        }
        // Update in current user bookings
        const userIndex = state.currentUserBookings.findIndex(b => b.id === updatedBooking.id);
        if (userIndex !== -1) {
          state.currentUserBookings[userIndex] = updatedBooking;
        }
      })
      
      // Update payment status
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        const updatedBooking = action.payload;
        // Update in admin bookings
        const adminIndex = state.bookings.findIndex(b => b.id === updatedBooking.id);
        if (adminIndex !== -1) {
          state.bookings[adminIndex] = updatedBooking;
        }
        // Update in current user bookings
        const userIndex = state.currentUserBookings.findIndex(b => b.id === updatedBooking.id);
        if (userIndex !== -1) {
          state.currentUserBookings[userIndex] = updatedBooking;
        }
      })
      
      // Delete booking
      .addCase(deleteBooking.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.bookings = state.bookings.filter(b => b.id !== deletedId);
        state.currentUserBookings = state.currentUserBookings.filter(b => b.id !== deletedId);
      })
      
      // Fetch booking stats
      .addCase(fetchBookingStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  }
});

export const { clearError, clearBookings } = bookingsSlice.actions;

// Selectors
export const selectAllBookings = (state) => state.bookings?.bookings || [];
export const selectCurrentUserBookings = (state) => state.bookings?.currentUserBookings || [];
export const selectBookingsLoading = (state) => state.bookings?.loading || false;
export const selectBookingsError = (state) => state.bookings?.error;
export const selectBookingStats = (state) => state.bookings?.stats || { confirmedCount: 0, totalRevenue: 0 };

export default bookingsSlice.reducer;