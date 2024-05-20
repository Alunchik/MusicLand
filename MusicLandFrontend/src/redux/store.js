
import { configureStore } from '@reduxjs/toolkit';
import songsSlice from './slices/songsSlice';
import messagesSlice from './slices/messagesSlice';
import jwtSlice from './slices/jwtSlice';
export default configureStore({
  reducer: {
    songs: songsSlice,
    messages: messagesSlice,
    jwt: jwtSlice,
  },
});