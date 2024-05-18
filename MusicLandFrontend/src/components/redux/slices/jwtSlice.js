import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import io from 'socket.io-client';


const url = "localhost:8088"

const jwtSlice = createSlice({
    name:'jwt',
    initialState: {
        jwt:"",
        status: "unauth",
    },
    reducers: {
      addJwt(state, action) {
          console.log(action)
          state.jwt = action.jwt;
          state.status = "auth";
        },
        deleteJwt(state, action) {
          console.log(action)
          state.jwt =  "";
          state.status = "unauth";
        },
  },
});
export const { addJwt, deleteJwt } = jwtSlice.actions;
export default jwtSlice.reducer;
