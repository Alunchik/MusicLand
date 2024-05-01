import { configureStore } from '@reduxjs/toolkit';
import songsSlice from './slices/songsSlice';
export default configureStore({
  reducer: {
    songs: songsSlice,
  },
});