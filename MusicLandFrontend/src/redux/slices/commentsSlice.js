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
const commentsSlice = createSlice({
    name:'comments',
    initialState: {
        comments: [],
        status: 'idle',
        songId: '',
        error: null
    },
    reducers: {
    },
    extraReducers(builder) {
        builder
          .addCase(fetchComments.pending, (state, action) => {
            state.status = 'loading'
          })
          .addCase(fetchComments.fulfilled, (state, action) => {
            state.status = 'succeeded'
            // Add any fetched songs to the array
            state.songId = action.payload.songId
            state.comments = action.payload.comments
          })
          .addCase(fetchComments.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
            console.log(state.error)
          })
          .addCase(addComment.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.comments = state.comments.concat(action.payload)
          })
      }
});

export const selectAllComments = state => state.comments.somments;

export const fetchComments = createAsyncThunk('songs/fetchComments', async (songId) => {
  const response = await axios.get('http://87.242.103.128:8088/comments', {
    mode: 'no-cors',
    params: {
      "songId": songId
    }
   });
   console.log(response)
   return {comments: response.data, songId: songId}
});

export const deleteComment = createAsyncThunk('scomments/deleteComment', async (id) => {
  const response = await axios.delete('http://87.242.103.128:8088/comments', 
    {headers: {
      "Content-type": "application/json",
      "Authorization": getCookie("token")
    },
  params: {
    id: id
  }
  });
   return response.data
});

export default commentsSlice.reducer;


export const addComment = createAsyncThunk('comments/addComment', async (comment) => {
  const response =  await axios.post("http://87.242.103.128localhost:8088/comments",
  comment,
    {headers: {
      "Content-type": "application/json",
      "Authorization": getCookie("token")
    },})
   console.log(response)
   return comment
});