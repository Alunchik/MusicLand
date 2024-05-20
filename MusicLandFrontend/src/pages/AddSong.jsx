import SongList from "../components/Song/SongList/SongList"
import React, { useEffect } from 'react'
import WebSocketElem from "../components/AudioPlayer"
import { useSelector, useDispatch } from 'react-redux'
import { useState } from "react"
import { Axios } from "axios"
import { fetchSongs, selectAllSongs, startListening, sendMessage } from "../components/redux/slices/songsSlice"
import axios from "axios"

import { addUserDetails, addJwt, fetchWithJwt} from "../components/redux/slices/jwtSlice"

const AddSong = () => 
  {
  
  const login = useSelector(state => state.jwt.login);
  const [result, setResult] = useState("");
  const dispatch = useDispatch();
  const OnSumbit = (event) => {
      event.preventDefault();
      dispatch(fetchWithJwt())
      console.log(login)
      const fileData = new FormData();
            fileData.append('audio', file);
      axios
        .post("http://localhost:8089/upload", fileData, {
          headers: {
            "Content-type": "multipart/form-data",
          }, params: {
            "login" : login,
          }
        })
        .then((res) => {
          var songId = res.data.fileId
          console.log(`Success: ` + songId);
          axios.post("http://localhost:8088/songs",
          {"title":name, "audioId":songId, "artistId": login}, {
            headers: {
              "Content-type": "application/json",
            },
          }).then((res) =>{
            setResult("Success");
            event.target.form.reset();
        }).catch((err) => {
          setResult("Error - " + err.data);
        });
    })
        .catch((err) => {
          setResult("Error - " + err.data);
        });
    };

    const [file, setFile] = useState('');
    const [name, setName] = useState('');


    const handleChangeFile = (e) => {
      const file = e.target.files[0]; // доступ к файлу
      console.log(file);
      setFile(file); // сохранение файла
    }

    const handleChangeName = (e) => {
       setName(e.target.value);
    }

  return(
        <main>
      <form onSubmit={OnSumbit}>
      <input onChange={handleChangeFile}
        accept="audio/wav"
        id="file"
        name="file"
        type="file"
      />
      <input type="text" onChange={handleChangeName} />
      <button></button>
      <div>{result}</div>
    </form>
        </main>
    );
}

export default AddSong;