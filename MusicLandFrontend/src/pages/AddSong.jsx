import { useSelector, useDispatch } from 'react-redux'
import { useState } from "react"
import axios from "axios"
import { jwtDecode } from 'jwt-decode'


import { fetchWithJwt } from "../redux/slices/jwtSlice"
const AddSong = () => 
  {
    function getCookie(name) {
      var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    }
  const jwt = getCookie("token")
  const decrypt = jwtDecode(jwt)
  const login = decrypt.Login
  const [result, setResult] = useState("");
  const dispatch = useDispatch();
  const OnSumbit = (event) => {
    event.preventDefault();
    if(!!name){
    if (file.name?.endsWith((".wav"))){
      setResult("Your file uploading is in process, please wait...")
      const fileData = new FormData();
            fileData.append('audio', file);
      axios
        .post(process.env.REACT_APP_API_URL + ":8089/upload", fileData, {
          headers: {
            "Content-type": "multipart/form-data",
            "Authorization": getCookie("token")
          }, params: {
            "login" : login,
          }
        })
        .then((res) => {
          var songId = res.data.fileId
          console.log(`Success: ` + songId);
          axios.post( process.env.REACT_APP_API_URL +  ":8088/songs",
          {"title":name, "audioId":songId, "artistId": login}, {
            headers: {
              "Content-type": "application/json",
              "Authorization": getCookie("token")
            },
          }).then((res) =>{
            setResult("Success");
            event.target.form.reset();
            document.location.reload()
        }).catch((err) => {
          if(!!err.data){
              setResult("Error - " + err.data);
          }
        });
    })
        .catch((err) => {
          if(!!err.data){
            setResult("Error - " + err.data);
        }
        });
      }
      else{
        setResult("Error - invalid format - acceptable format is .wav");
      }
    }
    else{
        setResult("Error -  title can not be empty")
    }
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
          <div class="addSong">
          <h1>Add song</h1>
      <form onSubmit={OnSumbit}>
        <div>
      <label htmlFor="file"><h3>load file here</h3></label>
      <input onChange={handleChangeFile}
        accept=".wav"
        id="file"
        name="file"
        type="file"
      /></div>
      <div>
      <label htmlFor="title"><h3>enter title here</h3></label>
      <input type="text" placeholder='enter title' id="title" onChange={handleChangeName} />
      </div>
      <button>Upload</button>
      <div>{result}</div>
    </form>
    <div>Please load files only in .wav format, now site supports only this format</div>
    </div>
        </main>
    );
}

export default AddSong;