import React, { Component } from "react";
import { useState } from "react";
import { useEffect } from "react";
import "../../../style/Songs/songElement.css";

const PlayButton = (props) => {

  // const [playing, setPlaying] = useState(false);
  // useEffect(() => {
  //   console.log('Состояние было изменено');
  //   if(playing){
  //     startSocket()
  //   }
  // }, [playing]);

  //   const togglePlaying = () => {
  //     setPlaying(!playing)
  //   }
    const id = props.id;
      const startSocket = () => {
        console.log(id)
       const socket = new WebSocket('ws://localhost:8089/audio')
       socket.binaryType = "arraybuffer"
          socket.onopen = (event) => {
              console.log("socket opened ");
              socket.send(id);
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
            
            console.log("sent");
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

      const notSupportedMsg =
      "Your browser does not support the <code>audio</code> element.";
      return(
          // {/* {(
          //   <div className={"audio-btn " + playing ? "play-btn" : "pause-btn"} onClick={togglePlaying}></div>
          // )} */}
          <div className={"audio-btn play-btn"} onClick={startSocket}></div>

      )
  }
  
  
export default PlayButton