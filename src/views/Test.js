// WebSocketClient.js
import React, { useEffect, useState } from 'react';
import { json, useParams } from 'react-router-dom';

const WebSocketClient = () => {

  const [messages, setMessages] = useState([]);
  const id = 'your_id_here'; 
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:2000'); // Changez l'URL en conséquence

    ws.onopen = () => {
        console.log('WebSocket connection opened');
        console.log(id);
        ws.send(JSON.stringify({id}))
    };

    ws.onmessage = (event) => {
        const receivedData = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, receivedData]);
        
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed');
    };

    // return () => {
    //     ws.close();
    // };
}, []);


return (
  <div className="App">
      <h2>Received Messages:</h2>
      {id &&<div>Details for ID: {id}</div>};
      <ul>
          {messages.map((message, index) => (
              <li key={index}>
                  <pre>{JSON.stringify(message, null, 2)}</pre>
              </li>
          ))}
      </ul>
  </div>
);
};

export default WebSocketClient;
