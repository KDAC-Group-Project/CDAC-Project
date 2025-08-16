import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer from './slices/wishlistSlice';
import toursReducer from './slices/toursSlice';
import bookingsReducer from './slices/bookingsSlice';
import usersReducer from './slices/usersSlice';

export const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
    tours: toursReducer,
    bookings: bookingsReducer,
    users: usersReducer,
  },
});