import React, { Component } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import deleteButtonImg from "../../../image/deleteButton.png"
import { useEffect } from "react";
import { deleteSong } from "../../../redux/slices/songsSlice";
import "../../../style/Songs/songElement.css";

const DeleteButton = (props) => {
  const id = props.id;
  const dispatch = useDispatch();
    const handleDelete = () => {
    //console.log("deleted " + props.id + " "  + props.AudioID)
    dispatch(deleteSong(props.AudioID))
  }
      return(
        <div className="deleteButton">
        <img onClick={handleDelete} src={deleteButtonImg} alt="-" width="30px" height="30px"/>
        </div>


      )
  }
  
  
export default DeleteButton