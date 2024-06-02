import React, { Component } from "react";
import { useState } from "react";
import { useEffect } from "react";
import "../../../style/Songs/songElement.css";
import { audioContext } from "../../../redux/slices/songsSlice";
function playAudio (audioData){
  // Декодируем аудиоданные в AudioBuffer
  audioContext.decodeAudioData(audioData, function(buffer) {
    // Создаем AudioBufferSourceNode
    const source = audioContext.createBufferSource();
    
    // Прикрепляем к AudioBufferSourceNode созданный AudioBuffer
    source.buffer = buffer;
    
    // Подключаем AudioBufferSourceNode к выходу AudioContext
    source.connect(audioContext.destination);
    
    // Начинаем воспроизведение
    source.start(0);
  });
      console.log("PLAYING")
  };

function startSocket (AudioID) {
  const socket = new WebSocket( process.env.REACT_APP_API_URL +  ':8089/audio')
  socket.binaryType = "arraybuffer"
     socket.onopen = (event) => {
         console.log("socket opened ");
         console.log(AudioID)
         socket.send(AudioID);
       };
     socket.onmessage = function (event) {
         const audio = event.data;
         if (audio instanceof ArrayBuffer) {
           playAudio(audio);
         }
         else{
           console.log("not array buffer");
         }
       };
       console.log("sent");
 };

class PlayButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      started: false,
      playing: false,
      audioContext:  "",
      AudioID: props.AudioID
    }
    console.log("constrr")
    console.log(props)
}
     
    toggleSongState = () => {
      if (!this.state.started) {
        this.setState( {...this.state, started:true,
           playing:true})
          startSocket(this.state.AudioID)
      } else if (this.state.playing) {
        this.setState({...this.state, playing:false})
        audioContext.suspend();
      } else if (!this.playing) {
        this.setState({...this.state,playing:true})
        audioContext.resume()
      }
      console.log(this.state)
  }
      render(){
        console.log("a")
        return(
        this.state.playing ? 
            <div className={"audio-btn pause-btn"} onClick={this.toggleSongState}></div> :
            <div className={"audio-btn play-btn"} onClick={this.toggleSongState}></div>
          
        )
};
  }
  
  
export default PlayButton