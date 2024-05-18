import SongList from "../components/Song/SongList/SongList"
import React, { useEffect } from 'react'
import WebSocketElem from "../components/AudioPlayer"
import { useSelector, useDispatch } from 'react-redux'
import { useState } from "react"
import { Axios } from "axios"
import { Link } from "react-router-dom"
import { addJwt} from '../components/redux/slices/jwtSlice';
import { fetchSongs, selectAllSongs, startListening, sendMessage } from "../components/redux/slices/songsSlice"

import axios from "axios"
const Login = () => {

  axios.defaults.headers.common = {
    ...axios.defaults.headers.common,
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    "Content-Type": 'application/json',
 };
 axios.defaults.preflightContinue = true;
 //axios.defaults.crossDomain = true;

  const authStatus = useSelector(state => state.jwt.status);
  const dispatch = useDispatch();
    const OnSumbit = (event) => {
      event.preventDefault();
      const data = {
        "login": name,
        "password":password,
      }
        axios.post("http://localhost:8087/login", data, {
          crossDomain : true,
          headers: {
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods":"*"
          },
        })
        .then((res) => {
          console.log(res);
          dispatch(addJwt({ jwt: res.data }));
          console.log(authStatus)
    })
        .catch((err) => {
          console.log("EEEEEEEER" + err.data);

        });
    };

   

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleChangeName = (e) => {
      setName(e.target.value)
    }

    const handleChangePassword = (e) => {
       setPassword(e.target.value)
    }

  return(
      <main>
      <form onSubmit={OnSumbit}>
      <Link to="/registration">Click to registration</Link>
        <label htmlFor="name">Login</label>
      <input type="text" name="name" id="name" onChange={handleChangeName} />
      <label htmlFor="password">Password</label>

      <input type="password" id="password" onChange={handleChangePassword} />
      <button>Login</button>
    </form>
        </main>
    );
}

export default Login;