import SongList from "../components/Song/SongList/SongList"
import React, { useEffect } from 'react'
import WebSocketElem from "../components/AudioPlayer"
import { useSelector, useDispatch } from 'react-redux'
import { useState } from "react"
import { Axios } from "axios"
import { Link } from "react-router-dom"
import { addJwt, addUserDetails, fetchWithJwt} from '../components/redux/slices/jwtSlice';
import { fetchSongs, selectAllSongs, startListening, sendMessage } from "../components/redux/slices/songsSlice"
import axios from "axios"
import { useCookies } from 'react-cookie'
import { useNavigate } from "react-router-dom"
const Login = () => {
  function hasCookie(name) {
    return document.cookie.split(';').some(c => c.trim().startsWith(name + '='));
  }
  const authStatus = useSelector(state => state.jwt.auth);
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(["token"]);
  const [err, setErr] = useState('');
  const navigate=useNavigate();
    const OnSumbit = (event) => {
      event.preventDefault();
      const data = {
        "login": name,
        "password":password,
      }
      console.log(data);
        axios.post('http://localhost:8087/login', data, {
          headers: {
            "Content-type": "application/json",
          },
        })
        .then((res) => {
          //dispatch(fetchWithJwt({ jwt: res.data.token }));
          setCookie("token", res.data.token, {sameSite:"None"})
          setCookie("login", res.data.token, {sameSite:"None"})
          console.log("kooo" + cookies.token)
          console.log(hasCookie("token"))
          navigate("/");
          document.location.reload();
    })
        .catch((err) => {
          console.log("Error" + err.data);
          setErr("Error - " + err.data)
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
      <div>{err}</div>
    </form>
        </main>
    );
}

export default Login;