import React, { Component } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setPlaying } from "../../../redux/slices/songsSlice";
import "../../../style/Songs/songElement.css";
import { refreshAudioContext, getAudioContext } from "../../../redux/slices/songsSlice";


// function playAudio (audioData){

//   var audioContext = getAudioContext();
//   // Декодируем аудиоданные в AudioBuffer
//   audioContext.decodeAudioData(audioData, function(buffer) {
//     // Создаем AudioBufferSourceNode
//     const source = audioContext.createBufferSource();
    
//     // Прикрепляем к AudioBufferSourceNode созданный AudioBuffer
//     source.buffer = buffer;
    
//     // Подключаем AudioBufferSourceNode к выходу AudioContext
//     source.connect(audioContext.destination);
    
//     // Начинаем воспроизведение
//     source.start(0);
//   });
//       console.log("PLAYING")
//   };

// function startSocket (AudioID) {
//   const socket = new WebSocket( process.env.REACT_APP_API_URL +  ':8089/audio')
//   socket.binaryType = "arraybuffer"
//      socket.onopen = (event) => {
//          console.log("socket opened ");
//          console.log(AudioID)
//          socket.send(AudioID);
//        };
//      socket.onmessage = function (event) {
//          const audio = event.data;
//          if (audio instanceof ArrayBuffer) {
//            playAudio(audio);
//          }
//          else{
//            console.log("not array buffer");
//          }
//        };
//        console.log("sent");
//  };

const PlayButton = (props) => {
// const dispatch = useDispatch()
// const current = useSelector(state => state.songs.currentSong);
// let playing = true;

//    const toggleSongState = () => {
//       let started = current == props.AudioID;
//       if (!started) {
//         refreshAudioContext();
//         dispatch(setCurrentSong({songID: props.AudioID}))
//         dispatch(setPlaying({playing: true}))
//         startSocket(props.AudioID)
//       } else if (playing) {
//         dispatch(setPlaying({playing: false}))
//         getAudioContext().suspend();
//       } else if (!playing) {
//         dispatch(setPlaying({playing: true}))
//         getAudioContext().resume()
//       }
//   }
        return(
        props.playing ? 
            <div className={"audio-btn pause-btn"} onClick={props.toggleSongState}></div> :
            <div className={"audio-btn play-btn"} onClick={props.toggleSongState}></div>
        )
};

export default PlayButton;
