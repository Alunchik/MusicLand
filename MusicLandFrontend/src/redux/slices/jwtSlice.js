import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from 'jwt-decode'
import { useDispatch } from "react-redux";
import io from 'socket.io-client';


const url = "localhost:8088"
function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}


const jwtSlice = createSlice({
    name:'jwt',
    initialState: {
        jwt:"",
        isAuth: false,
        login: "",
        name: "",
        role:"",
        loadingStatus: 'idle', error: null
    },
    reducers: {
      addJwt(state, action) {
          state.jwt = action.jwt;
          state.isAuth= true;
        },
        addUserDetails(state, action) {
          state.login = action.login;
          state.name = action.name;
        },
        
        logOut(state, action) {
          state.jwt =  "";
          state.name= "";
          state.login=""
          state.isAuth=false;
        },
  },
  extraReducers: (builder) => {
    builder
      // Вызывается прямо перед выполнением запроса
      .addCase(fetchWithJwt.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      // Вызывается, если запрос успешно выполнился
      .addCase(fetchWithJwt.fulfilled, (state, action) => {
        // Добавляем пользователя
        console.log(action.payload)
        state.name = action.payload.name
        state.login=action.payload.login
        state.jwt=action.payload.jwt
        state.isAuth=true
        state.role=action.payload.role
        console.log(action.payload.role + " role")
        state.loadingStatus = 'idle';
        state.error = null;
      })
      // Вызывается в случае ошибки
      .addCase(fetchWithJwt.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error;
      });
  },
  
});

export const fetchWithJwt = createAsyncThunk('jwt/fetchWithJwt', 
async() => 
  {
  const jwt = getCookie("token")
  const decrypt = jwtDecode(jwt)
  const login = decrypt.Login
  const res = await axios.get("http://87.242.103.128:8087/getUserByLogin", {
    params: {"login": login},
    headers: {
      "Content-type": "application/json",
      "Authorization": jwt,
    },
  }).then(res =>{
    console.log(res.data.role + "rrr")
    if(res.data.role === "admin"){
      console.log("adm")
      var cookie_date = new Date();
      cookie_date.setMonth(cookie_date.getMonth() + 1);
    document.cookie = "isAdmin=yes;expires=" + cookie_date.toUTCString();
    }
 return res;
    });
    return{
      jwt: jwt,
      name:res.data.name,
      login:login,
      role: res.data.role
    }
  });
export const { addJwt, logOut, addUserDetails } = jwtSlice.actions;
export default jwtSlice.reducer;
