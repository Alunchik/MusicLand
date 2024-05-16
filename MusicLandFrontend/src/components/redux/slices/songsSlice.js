import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import io from 'socket.io-client';


const url = "localhost:8088"

const songsSlice = createSlice({
    name:'songs',
    initialState: {
        songs: [],
        status: 'idle',
        error: null
    },
    reducers: {
    },
    extraReducers(builder) {
        builder
          .addCase(fetchSongs.pending, (state, action) => {
            state.status = 'loading'
          })
          .addCase(fetchSongs.fulfilled, (state, action) => {
            state.status = 'succeeded'
            // Add any fetched songs to the array
            state.songs = state.songs.concat(action.payload)
          })
          .addCase(fetchSongs.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
            console.log(state.error)
          })
      }
});






const socket = io('<wss://localhost:8089>');

export const CONNECT_SOCKET = 'CONNECT_SOCKET';
export const DISCONNECT_SOCKET = 'DISCONNECT_SOCKET';
export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';

export const connectSocket = () => ({
  type: CONNECT_SOCKET,
});

export const disconnectSocket = () => ({
  type: DISCONNECT_SOCKET,
});

export const receiveMessage = (message) => ({
  type: RECEIVE_MESSAGE,
  payload: message,
});

export const sendMessage = (message) => (dispatch) => {
  socket.emit('message', message);
};

export const startListening = () => (dispatch) => {
  dispatch(connectSocket());

  socket.on('connect', () => {
    console.log('Соединение установлено');
  });

  socket.on('message', (data) => {
    dispatch(receiveMessage(data));
  });

  socket.on('disconnect', () => {
    dispatch(disconnectSocket());
    console.log('Соединение закрыто');
  });
};

export const selectAllSongs = state => state.songs.songs;

export const fetchSongs = createAsyncThunk('songs/fetchSongs', async () => {
  const response = await axios.get('http://localhost:8088/songs', {
    mode: 'no-cors',
   });
   console.log(response)
   return response.data
});

export default songsSlice.reducer;
