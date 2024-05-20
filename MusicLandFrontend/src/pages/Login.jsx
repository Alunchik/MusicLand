import SongList from "../components/Song/SongList/SongList"
import React, { useEffect } from 'react'
import WebSocketElem from "../components/AudioPlayer"
import { useSelector, useDispatch } from 'react-redux'
import { useState } from "react"
import { Axios } from "axios"
import { Link } from "react-router-dom"
import axios from "axios"
import { useCookies } from 'react-cookie'
import { useNavigate } from "react-router-dom"
import { fetchWithJwt } from "../redux/slices/jwtSlice"
const Login = () => {
  function hasCookie(name) {
    return document.cookie.split(';').some(c => c.trim().startsWith(name + '='));
  }
  const role = useSelector(state => state.jwt.role);
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(["token", "isAdmin"]);
  const [err, setErr] = useState('');
  const navigate=useNavigate();
    const OnSumbit = (event) => {
      event.preventDefault();
      const data = {
        "login": name,
        "password":password,
      }
      console.log(data);
        axios.post('http://87.242.103.128:8087/login', data, {
          headers: {
            "Content-type": "application/json",
          },
        })
        .then((res) => {
          //dispatch(fetchWithJwt({ jwt: res.data.token }));
          var cookie_date = new Date();
          cookie_date.setMonth(cookie_date.getMonth() + 1);
        document.cookie = "token=" +  res.data.token + ";expires=" + cookie_date.toUTCString();
        document.cookie = "login=" +  name + ";expires=" + cookie_date.toUTCString();
          dispatch(fetchWithJwt())
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
      <input type="text" name="login" id="name" onChange={handleChangeName} />
      <label htmlFor="password">Password</label>

      <input type="password" id="password" onChange={handleChangePassword} />
      <button>Login</button>
      <div>{err}</div>
    </form>
        </main>
    );
}

export default Login;