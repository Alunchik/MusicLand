import SongList from "../components/Song/SongList/SongList"
import React, { useEffect } from 'react'
import WebSocketElem from "../components/AudioPlayer"
import { useSelector, useDispatch } from 'react-redux'
import { useState } from "react"
import { Axios } from "axios"
import { fetchSongs, selectAllSongs, startListening, sendMessage } from "../components/redux/slices/songsSlice"

import axios from "axios"
const AddSong = () => {
    const OnSumbit = (event) => {
      event.preventDefault();
      const formData = new FormData(event.target.form);
      const fileData = new FormData();
      console.log(formData)
      fileData.append('audio', file);
  
      axios
        .post("http://localhost:8089/upload", fileData, {
          headers: {
            "Content-type": "multipart/form-data",
          },
        })
        .then((res) => {
          var songId = res.data.fileId
          console.log(`Success: ` + songId);
          axios.post('http://localhost:8088/songs',
          {"title":name, "audioId":songId}, {
    mode: 'no-cors',
          }).then((res) =>{
          console.log(`Success:!!!!`);
        }).catch((err) => {
          console.log("AAA", err);
        });
    })
        .catch((err) => {
          console.log(err);
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
    </form>
        </main>
    );
}

export default AddSong;