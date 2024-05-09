import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage} from './redux/slices/messagesSlice';
const WebSocketElem = () =>{

  const socket = new WebSocket('ws://localhost:8089');

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
          const json = event.data;
          try {
            console.log("got: " + json)
            dispatch(addMessage({ message: json }));
          } catch (err) {
            console.log(err);
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

  startListening()

  return (
    <div>
      <ul>
        {messages.map((message) => (
          <li>{message.text}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" name="message" />
        <button>Отправить</button>
      </form>
    </div>
  );
}

export default WebSocketElem;