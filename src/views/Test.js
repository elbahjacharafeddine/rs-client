// WebSocketClient.js
import React, { useEffect, useState ,useRef } from 'react';
import { json, useParams } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
const WebSocketClient = () => {

    const [messages, setMessages] = useState([]);
    const id = 'your_id_here';
    const toast = useRef(null);
    const show = () => {
        toast.current.show({ severity: 'info', summary: 'Info', detail: 'Message Content' });
    };

    return (
        <div className="App">
            <h2>Received Messages:</h2>
            <div className="card flex justify-content-center">
                <Toast ref={toast} />
                <Button onClick={show} label="Show" />
            </div>

        </div>
    );
};

export default WebSocketClient;
