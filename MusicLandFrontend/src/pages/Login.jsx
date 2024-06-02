import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from "react"
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
      console.log(process.env.REACT_APP_API_URL + ':8087/login')
        axios.post(process.env.REACT_APP_API_URL + ':8087/login', data, {
          headers: {
            "Content-type": "application/json",
          },
        })
        .then((res) => {
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
      <h1>Login</h1>
        <label htmlFor="name">Login</label>
      <input type="text" name="login" id="name" onChange={handleChangeName} />
      <label htmlFor="password">Password</label>
      <input type="password" id="password" onChange={handleChangePassword} />
      <button>Login</button>
      <div>
        <h3>New here?
          <br/>
        <Link to="/registration" class="navLink">Go to registration</Link>
        </h3>
      </div>
      <div>{err}</div>
    </form>
        </main>
    );
}

export default Login;