import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
const WebSocketElem = () =>{

  const socket = new WebSocket( process.env.REACT_APP_API_URL +  ':8089/audio');
  socket.binaryType = "arraybuffer"

  const dispatch = useDispatch()

  const sendMessage = (message) => {
      socket.send(message);
      console.log("sent")
    };
  
  
  const startListening = () => {
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
  };

  //const dispatch = useDispatch();

  const messages = useSelector((state) => state.messages.messages);

  const handleSubmit = (event) => {
    event.preventDefault();
    const message = event.target.elements.message.value;
    sendMessage(message);
    event.target.elements.message.value = '';
    console.log(messages)
  };

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

  startListening()

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="message" />
        <button>Слушать</button>
      </form>
    </div>
  );
}

export default WebSocketElem;