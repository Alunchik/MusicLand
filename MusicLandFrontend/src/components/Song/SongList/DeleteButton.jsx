import React, { Component } from "react";
import deleteButtonImg from "../../../assets/deleteButton.png"
import { deleteSong } from "../../../redux/slices/songsSlice";
import "../../../style/Songs/songElement.css";
import { useDispatch } from "react-redux";


const DeleteButton = (props) => {
  const id = props.id;
  const AudioId = props.AudioId;
  const dispatch = useDispatch();
    const handleDelete = () => {
    dispatch(deleteSong({id, AudioId}))
  }
      return(
        <div className="deleteButton">
        <img onClick={handleDelete} src={deleteButtonImg} alt="-" width="30px" height="30px"/>
        </div>
      )
  }
  
  
export default DeleteButton