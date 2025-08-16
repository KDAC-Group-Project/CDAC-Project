import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tourAPI } from '../../services/api';

// Async thunks
export const fetchTours = createAsyncThunk(
  'tours/fetchTours',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tourAPI.getAllTours();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tours');
    }
  }
);

export const fetchTourById = createAsyncThunk(
  'tours/fetchTourById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await tourAPI.getTourById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tour');
    }
  }
);

export const createTour = createAsyncThunk(
  'tours/createTour',
  async (tourData, { rejectWithValue }) => {
    try {
      const response = await tourAPI.createTour(tourData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create tour');
    }
  }
);

export const updateTour = createAsyncThunk(
  'tours/updateTour',
  async ({ id, tourData }, { rejectWithValue }) => {
    try {
      const response = await tourAPI.updateTour(id, tourData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update tour');
    }
  }
);

export const deleteTour = createAsyncThunk(
  'tours/deleteTour',
  async (id, { rejectWithValue }) => {
    try {
      await tourAPI.deleteTour(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete tour');
    }
  }
);

export const activateTour = createAsyncThunk(
  'tours/activateTour',
  async (id, { rejectWithValue }) => {
    try {
      await tourAPI.activateTour(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to activate tour');
    }
  }
);

export const deactivateTour = createAsyncThunk(
  'tours/deactivateTour',
  async (id, { rejectWithValue }) => {
    try {
      await tourAPI.deactivateTour(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deactivate tour');
    }
  }
);

const initialState = {
  tours: [],
  currentTour: null,
  loading: false,
  error: null,
  filters: {
    category: '',
    destination: '',
    priceRange: { min: 0, max: 10000 },
    durationRange: { min: 1, max: 30 }
  }
};

const toursSlice = createSlice({
  name: 'tours',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentTour: (state) => {
      state.currentTour = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch tours
      .addCase(fetchTours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTours.fulfilled, (state, action) => {
        state.loading = false;
        state.tours = action.payload;
        state.error = null;
      })
      .addCase(fetchTours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch tour by ID
      .addCase(fetchTourById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTourById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTour = action.payload;
        state.error = null;
      })
      .addCase(fetchTourById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create tour
      .addCase(createTour.fulfilled, (state, action) => {
        state.tours.push(action.payload);
      })
      
      // Update tour
      .addCase(updateTour.fulfilled, (state, action) => {
        const index = state.tours.findIndex(tour => tour.id === action.payload.id);
        if (index !== -1) {
          state.tours[index] = action.payload;
        }
        if (state.currentTour?.id === action.payload.id) {
          state.currentTour = action.payload;
        }
      })
      
      // Delete tour
      .addCase(deleteTour.fulfilled, (state, action) => {
        state.tours = state.tours.filter(tour => tour.id !== action.payload);
        if (state.currentTour?.id === action.payload) {
          state.currentTour = null;
        }
      })
      
      // Activate tour
      .addCase(activateTour.fulfilled, (state, action) => {
        const tour = state.tours.find(t => t.id === action.payload);
        if (tour) tour.isActive = true;
        if (state.currentTour?.id === action.payload) {
          state.currentTour.isActive = true;
        }
      })
      
      // Deactivate tour
      .addCase(deactivateTour.fulfilled, (state, action) => {
        const tour = state.tours.find(t => t.id === action.payload);
        if (tour) tour.isActive = false;
        if (state.currentTour?.id === action.payload) {
          state.currentTour.isActive = false;
        }
      });
  }
});

export const { clearError, setFilters, clearFilters, clearCurrentTour } = toursSlice.actions;

// Selectors
export const selectTours = (state) => state.tours?.tours || [];
export const selectCurrentTour = (state) => state.tours?.currentTour;
export const selectToursLoading = (state) => state.tours?.loading || false;
export const selectToursError = (state) => state.tours?.error;
export const selectToursFilters = (state) => state.tours?.filters;

export default toursSlice.reducer;