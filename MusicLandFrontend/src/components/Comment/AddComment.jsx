import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from "react"
import { Axios } from "axios"
import axios from "axios"
import { fetchWithJwt } from '../../redux/slices/jwtSlice'
import { addComment } from "../../redux/slices/commentsSlice"

const AddComment = (props) => 
  {
  const login = useSelector(state => state.jwt.login);
  const dispatch = useDispatch();
  const OnSumbit = (event) => {
      event.preventDefault();
      dispatch(fetchWithJwt())
      console.log(login)
      const data = {
        "text": text,
        "authorId":login,
        "songId":props.songId
      }
      dispatch(addComment(data))
            event.target.form.reset();
    }

    const [text, setText] = useState('');

    const handleChangeText = (e) => {
       setText(e.target.value);
    }

  return(
        <main>
      <form onSubmit={OnSumbit}>
        <div>
      <input type="text" onChange={handleChangeText} />
      <button></button>
      </div>
    </form>
        </main>
    );
}

export default AddComment;