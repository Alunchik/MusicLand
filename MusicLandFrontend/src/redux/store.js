import { configureStore } from '@reduxjs/toolkit';
import songsSlice from './slices/songsSlice';
import jwtSlice from './slices/jwtSlice';
import commentsSlice from './slices/commentsSlice';
export default configureStore({
  reducer: {
    songs: songsSlice,
    comments: commentsSlice,
    jwt: jwtSlice,
  },
});