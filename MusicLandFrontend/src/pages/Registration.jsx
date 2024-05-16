import SongList from "../components/Song/SongList/SongList"
import React, { useEffect } from 'react'
import WebSocketElem from "../components/AudioPlayer"
import { useSelector, useDispatch } from 'react-redux'
import { useState } from "react"

import axios from "axios"
const Registration = () => {
    const OnSumbit = (event) => {
      event.preventDefault();
      const formData = new FormData(event.target.form)
        axios.post("http://localhost:8087/registration", formData, {
          headers: {
            "Content-type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res);
    })
        .catch((err) => {
          console.log(err);
        });
    };

    const [file, setName] = useState('');
    const [name, setPassword] = useState('');


    const handleChangeName = (e) => {
      setName(e.target.value)
    }

    const handleChangePassword = (e) => {
       setPassword(e.target.value)
    }

  return(
      <main>
      <form onSubmit={OnSumbit}>
      <input type="text" name="name" id="name" onChange={handleChangeName} />
      <input type="password" id="password" onChange={handleChangePassword} />
      <button>Register</button>
    </form>
        </main>
    );
}

export default Registration;