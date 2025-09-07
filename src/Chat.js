import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

const Chat = () => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const conn = new signalR.HubConnectionBuilder()
.withUrl("http://localhost:5027/chathub")
      .withAutomaticReconnect()
      .build();

    setConnection(conn);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected!");
        console.log("merve");

          connection.on("ReceiveMessage", (user, content, timestamp) => {
            setMessages((prev) => [...prev, { user, content, timestamp }]);
          });
        })
        .catch((err) => console.error("SignalR Connection Error:", err));
    }
  }, [connection]);

  const sendMessage = async () => {
    if (connection.state===signalR.HubConnectionState.Connected) {
      try {
        await connection.send("SendMessage", user, message);
        setMessage("");
      } catch (err) {
        console.error(err);
        console.error("Connection is not active");
      }
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Realtime Chat</h2>
      <input
        placeholder="Name"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />
      <br />
      <input
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>
            <strong>{msg.user}</strong>: {msg.content} <i>({msg.timestamp})</i>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Chat;
