import React, { Component } from "react";

import "../../../style/Songs/songElement.css";

const PlayButton = (props) => {

      const playing = true

      const id = props.id
    
      const startSocket = (id) => {
       const socket = new WebSocket('ws://localhost:8089/audio')
       socket.binaryType = "arraybuffer"
          socket.onopen = (event) => {
              console.log("socket opened"+event.data);
            };
      
          socket.onmessage = function (event) {
              const audio = event.data;
              try {
                console.log("got: " + audio)
                //dispatch(addMessage({ message: audio }));
              } catch (err) {
                console.log(err);
              }
              if (audio instanceof ArrayBuffer) {
              playAudio(audio);
              }
              else{
                console.log("not array buffer");
              }
            };
            socket.send(id);
      };
    
      //const dispatch = useDispatch();
    
      //const messages = useSelector((state) => state.messages.messages);
    
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const playAudio = (audioData) => {
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
        
        // Начинаем воспроизведение
        console.log("PLAYING")
    };
      
    const onPlay = (event) => {
      this.setState({ playing: true });
      startSocket()
      playAudio()
    };
   const  onPause = (event) => {
      this.setState({ playing: false });
    };
   const  onEnded = (event) => {
      this.setState({ playing: false });
    };
    
      const pauseAudio = () => {
        console.log("pausing")
        this.setState({ playing: false });
      };
      const notSupportedMsg =
      "Your browser does not support the <code>audio</code> element.";
      return(
        <>
          {!playing && (
            <div className="audio-btn pause-btn" onClick={startSocket}></div>
          )}
          {playing && <div className="audio-btn play-btn" onClick={pauseAudio}></div>}

        </>
      )
  }
  
export default PlayButton