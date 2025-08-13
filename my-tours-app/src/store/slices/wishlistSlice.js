import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMyWishlist, addToWishlistCurrent, removeFromWishlistCurrent } from '../../services/api';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks for backend sync
export const fetchWishlistFromBackend = createAsyncThunk(
  'wishlist/fetchFromBackend',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getMyWishlist();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToWishlistBackend = createAsyncThunk(
  'wishlist/addToBackend',
  async (payload, { rejectWithValue }) => {
    try {
      const tourId = typeof payload === 'object' ? payload.id : payload;
      await addToWishlistCurrent(tourId);
      return payload; // Prefer returning full tour object if provided for optimistic UI update
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromWishlistBackend = createAsyncThunk(
  'wishlist/removeFromBackend',
  async (tourId, { dispatch, rejectWithValue }) => {
    try {
      await removeFromWishlistCurrent(tourId);
      return tourId;
    } catch (error) {
      // Auto-revert by re-fetching the wishlist from backend
      dispatch(fetchWishlistFromBackend());
      return rejectWithValue(error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload.id);
    },
    clearWishlist: (state) => {
      state.items = [];
    },
    setWishlistItems: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistFromBackend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlistFromBackend.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchWishlistFromBackend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Optimistic removal on pending
      .addCase(removeFromWishlistBackend.pending, (state, action) => {
        const pendingRemovedId = action.meta.arg;
        state.items = state.items.filter(item => String(item.id) !== String(pendingRemovedId));
      })
      // Optimistic add on pending
      .addCase(addToWishlistBackend.pending, (state, action) => {
        const payload = action.meta.arg;
        const pendingId = typeof payload === 'object' ? payload.id : payload;
        const exists = state.items.some(item => String(item.id) === String(pendingId));
        if (!exists) {
          const itemToAdd = typeof payload === 'object' ? payload : { id: pendingId };
          state.items.push(itemToAdd);
        }
      })
      .addCase(addToWishlistBackend.fulfilled, (state, action) => {
        const payload = action.payload;
        const addedId = typeof payload === 'object' ? payload.id : payload;
        const exists = state.items.some(item => String(item.id) === String(addedId));
        if (!exists) {
          // Optimistically add full tour object if available; otherwise, add minimal placeholder
          const itemToAdd = typeof payload === 'object' ? payload : { id: addedId };
          state.items.push(itemToAdd);
        }
        state.error = null;
      })
      .addCase(addToWishlistBackend.rejected, (state, action) => {
        const payload = action.meta.arg;
        const failedId = typeof payload === 'object' ? payload.id : payload;
        state.items = state.items.filter(item => String(item.id) !== String(failedId));
        state.error = action.payload || 'Failed to add to wishlist';
      })
      .addCase(removeFromWishlistBackend.fulfilled, (state, action) => {
        const removedId = action.payload;
        state.items = state.items.filter(item => String(item.id) !== String(removedId));
      });
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist, setWishlistItems } = wishlistSlice.actions;
export default wishlistSlice.reducer;