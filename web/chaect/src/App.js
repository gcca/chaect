import { createRef, useEffect, useState } from "react";
import "./App.css";
import TopBar from "./layout/topbar";

import ChatService from "./services/chatservice";
import ChatList from "./components/chatlist";
import ChatInput from "./components/chatinput";

export default function App() {
  const [chatservice] = useState(new ChatService());
  const [messages, setMessages] = useState([]);
  const inputRef = createRef();

  chatservice.SafeConnected().OnMessage((message) => {
    setMessages([...messages, message]);
  });

  const SendMessage = (message) => {
    chatservice.SafeConnected().Send(message);
  };

  useEffect(() => {
    inputRef.current.focus();
  });

  return (
    <div className="App">
      <TopBar></TopBar>
      <div id="chat-box" className="container">
        <ChatInput SendMessage={SendMessage} inputRef={inputRef}></ChatInput>
        <ChatList messages={messages}></ChatList>
      </div>
    </div>
  );
}
