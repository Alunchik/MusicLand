import SongList from "../components/Song/SongList/SongList"
import React, { useEffect } from 'react'
import WebSocketElem from "../components/AudioPlayer"
import { useSelector, useDispatch } from 'react-redux'
import { useState } from "react"

import axios from "axios"
const Registration = () => {
  const [err, setErr] = useState('')
    const OnSumbit = (event) => {
      event.preventDefault();
      const data = {
        "login": login,
        "password":passord,
        "name":name
      }
      console.log(data)
        axios.post("http://localhost:8087/register", data, {
          headers: {
            "Content-type": "application/json",
          },
        })
        .then((res) => {
          console.log(res);
          console.log("SUCCESS")

    })
        .catch((err) => {
          console.log(err);
          setErr(err.data)
        });
    };

    const [name, setName] = useState('');
    const [passord, setPassword] = useState('');
    const [login, setLogin] = useState('');



    const handleChangeName = (e) => {
      setName(e.target.value)
    }

    const handleChangePassword = (e) => {
       setPassword(e.target.value)
    }

    
    const handleChangeLogin = (e) => {
      setLogin(e.target.value)
   }
  return(
      <main>
      <form onSubmit={OnSumbit}>
        <label htmlFor="login">Login</label>
      <input type="login" name="login" id="login" onChange={handleChangeLogin} />
      <label htmlFor="name">Name</label>

      <input type="name" id="name" onChange={handleChangeName} />
      <label htmlFor="password">Password</label>

      <input type="password" id="password" onChange={handleChangePassword} />
      <button>Registration</button>
      <div class="error">{err}</div>
    </form>
        </main>
    );
}

export default Registration;