import React, { useEffect } from 'react'
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import axios from "axios"
const Registration = () => {
  const navigate=useNavigate();
  const [err, setErr] = useState('');
    const OnSumbit = (event) => {
      event.preventDefault();
      const data = {
        "login": login,
        "password":passord,
        "name":name
      }
      console.log(data)
        axios.post("http://87.242.103.128:8087/register", data, {
          headers: {
            "Content-type": "application/json",
          },
        })
        .then((res) => {
          console.log(res);
          console.log("SUCCESS")
          setErr("Success");
          navigate("/login");
    })
        .catch((err) => {
          console.log(err);
          setErr("Error - " + err.data)
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
      <h1>Registration</h1>
      <label htmlFor="login">Login</label>
      <input type="login" name="login" id="login" onChange={handleChangeLogin} />
      <label htmlFor="name">Name</label>
      <input type="name" id="name" onChange={handleChangeName} />
      <label htmlFor="password">Password</label>
      <input type="password" id="password" onChange={handleChangePassword} />
      <button>Register</button>

      <h3>Already have an account?
      <br/>
        <Link to="/login" class="navLink">Login</Link>
      </h3>
      <div class="error">{err}</div>
    </form>

        </main>
    );
}

export default Registration;