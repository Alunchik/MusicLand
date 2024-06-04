import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import getCookie from "../../util/getcookie";


const songsSlice = createSlice({
    name:'songs',
    initialState: {
        songs: [],
        status: 'idle',
        mySongStatus: 'idle',
        error: null,
        currentSong:"",
        playing: false,
        position: 0
    },
    reducers: {
      setCurrent(state, action){
        state.currentSong=action.payload.songID
      },
      setPlaying(state, action){
        state.playing=action.payload.playing
      },
      setPosition(state, action){
        console.log("settt" + action.payload.position)
        state.position=action.payload.position
      }
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
            document.location.reload()
          })
      }
});

export const selectAllSongs = state => state.songs.songs;


export const fetchSongs = createAsyncThunk('songs/fetchSongs', async () => {
  const response = await axios.get(process.env.REACT_APP_API_URL + ':8088/songs', {
    mode: 'no-cors',
   });
   console.log(response)
   return response.data
});

export const deleteSong = createAsyncThunk('songs/deleteSong', async ({id, AudioId}) => {
  console.log("id audio: " + AudioId)
  console.log("id : " + id)
  const response = await axios.delete(process.env.REACT_APP_API_URL + ':8088/admin/songs', {
    mode: 'no-cors',  
  headers: {
      "Authorization": getCookie("token"),
      "Access-Control-Allow-Origin": "*",
    }, params: {
      id:id
    }
     })
   .then((res) => {
    axios.delete(process.env.REACT_APP_API_URL + ':8089/admin/delete', {
      headers: {
        "Authorization": getCookie("token"),
        "Access-Control-Allow-Origin": "*",
      },
      params: {
        id: AudioId
      }
   })
   .catch (err => {
    alert(err)
   })
   }).catch(err =>{
    alert(err)
   });
   return 
});

export default songsSlice.reducer;

export const {setCurrent, setPlaying, setPosition} = songsSlice.actions;

var audioContext  = new (window.AudioContext || window.webkitAudioContext)();

export const refreshAudioContext = () => { audioContext.close(); audioContext  = new (window.AudioContext || window.webkitAudioContext)()};

export const getAudioContext = () => { return audioContext};

export const fetchSongsByUser = createAsyncThunk('songs/fetchSongsByUser', async (login) => {
  const response = await axios.get( process.env.REACT_APP_API_URL + ':8088/songs/byUser', {
    mode: 'no-cors',
   });
   console.log(response)
   return response.data
});