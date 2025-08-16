import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userAPI } from '../../services/api';

// Async thunks
export const fetchAllUsers = createAsyncThunk(
  'users/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getAllUsers();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const fetchActiveUsers = createAsyncThunk(
  'users/fetchActiveUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getActiveUsers();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active users');
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await userAPI.getUserById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await userAPI.updateUser(id, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await userAPI.deleteUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

export const activateUser = createAsyncThunk(
  'users/activateUser',
  async (id, { rejectWithValue }) => {
    try {
      await userAPI.activateUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to activate user');
    }
  }
);

export const deactivateUser = createAsyncThunk(
  'users/deactivateUser',
  async (id, { rejectWithValue }) => {
    try {
      await userAPI.deactivateUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deactivate user');
    }
  }
);

export const searchUsers = createAsyncThunk(
  'users/searchUsers',
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await userAPI.searchUsers(searchTerm);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search users');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'users/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await userAPI.updateProfile(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

const initialState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  stats: {
    totalUsers: 0,
    activeUsers: 0
  }
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUsers: (state) => {
      state.users = [];
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch active users
      .addCase(fetchActiveUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchActiveUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const index = state.users.findIndex(user => user.id === updatedUser.id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
        if (state.currentUser?.id === updatedUser.id) {
          state.currentUser = updatedUser;
        }
      })
      
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.users = state.users.filter(user => user.id !== deletedId);
        if (state.currentUser?.id === deletedId) {
          state.currentUser = null;
        }
      })
      
      // Activate user
      .addCase(activateUser.fulfilled, (state, action) => {
        const userId = action.payload;
        const user = state.users.find(u => u.id === userId);
        if (user) user.isActive = true;
        if (state.currentUser?.id === userId) {
          state.currentUser.isActive = true;
        }
      })
      
      // Deactivate user
      .addCase(deactivateUser.fulfilled, (state, action) => {
        const userId = action.payload;
        const user = state.users.find(u => u.id === userId);
        if (user) user.isActive = false;
        if (state.currentUser?.id === userId) {
          state.currentUser.isActive = false;
        }
      })
      
      // Search users
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      
      // Update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        if (state.currentUser?.id === updatedUser.id) {
          state.currentUser = updatedUser;
        }
        // Also update in users array if it exists there
        const index = state.users.findIndex(user => user.id === updatedUser.id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      });
  }
});

export const { clearError, clearUsers, setCurrentUser, clearCurrentUser } = usersSlice.actions;

// Selectors
export const selectAllUsers = (state) => state.users?.users || [];
export const selectCurrentUser = (state) => state.users?.currentUser;
export const selectUsersLoading = (state) => state.users?.loading || false;
export const selectUsersError = (state) => state.users?.error;
export const selectUserStats = (state) => state.users?.stats || { totalUsers: 0, activeUsers: 0 };

export default usersSlice.reducer;