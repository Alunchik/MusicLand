
import { configureStore } from '@reduxjs/toolkit';
import songsSlice from './slices/songsSlice';
import messagesSlice from './slices/messagesSlice';
export default configureStore({
  reducer: {
    songs: songsSlice,
    messages: messagesSlice,
  },
});