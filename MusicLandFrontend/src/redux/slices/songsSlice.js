import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import io from 'socket.io-client';


const url = "localhost:8088"
function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
const songsSlice = createSlice({
    name:'songs',
    initialState: {
        songs: [],
        status: 'idle',
        mySongStatus: 'idle',
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
            state.songs = action.payload
          })
          .addCase(fetchSongs.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
            console.log(state.error)
          })
          .addCase(fetchSongsByUser.fulfilled, (state, action) => {
            state.mySongsStatus = 'succeeded'
            // Add any fetched songs to the array
            state.songs = action.payload
          })
          .addCase(deleteSong.fulfilled, (state, action) => {
            state.status = 'succeeded'
            // TODO: Delete the song from array
          })
      }
});

export const selectAllSongs = state => state.songs.songs;

export const fetchSongs = createAsyncThunk('songs/fetchSongs', async () => {
  const response = await axios.get('http://localhost:8088/songs', {
    mode: 'no-cors',
   });
   console.log(response)
   return response.data
});

export const deleteSong = createAsyncThunk('songs/deleteSong', async () => {
  const response = await axios.delete('http://localhost:8088/songs', {
    mode: 'no-cors',
   }).then((res) => {
    axios.delete('http://localhost:8089/delete', {
      headers: {
        "Authorization": getCookie("token")
      }
   })
   })
   return response.data
});

export default songsSlice.reducer;


export const fetchSongsByUser = createAsyncThunk('songs/fetchSongsByUser', async (login) => {
  const response = await axios.get('http://localhost:8088/songs/byUser', {
    mode: 'no-cors',
   });
   console.log(response)
   return response.data
});