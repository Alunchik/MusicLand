import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
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

export const selectAllSongs = state => state.songs.songs;

export const fetchSongs = createAsyncThunk('songs/fetchSongs', async () => {
  console.log(111)  
  const response = await axios.get('http://localhost:8088/songs', {
     mode: 'no-cors',
    });
    console.log(response)
    return response.data
});

export default songsSlice.reducer;
