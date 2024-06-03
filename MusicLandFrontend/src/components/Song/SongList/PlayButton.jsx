import React, { Component } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setPlaying } from "../../../redux/slices/songsSlice";
import "../../../style/Songs/songElement.css";
import { refreshAudioContext, getAudioContext } from "../../../redux/slices/songsSlice";

const PlayButton = (props) => {
        return(
        props.playing ? 
            <div className={"audio-btn pause-btn"} onClick={props.toggleSongState}></div> :
            <div className={"audio-btn play-btn"} onClick={props.toggleSongState}></div>
        )
};

export default PlayButton;
