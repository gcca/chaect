import { useState } from "react";

export default function ChatInput({ SendMessage, inputRef }) {
  const [message, setMessage] = useState("");

  function AddMessage() {
    SendMessage(message);
    inputRef.current.value = "";
    inputRef.current.focus();
  }

  return (
    <div className="field has-addons">
      <div className="control">
        <input
          className="input"
          type="text"
          ref={inputRef}
          onChange={(evt) => setMessage(evt.target.value)}
          onKeyDown={(evt) => {
            if (evt.key == "Enter") AddMessage();
          }}
        />
      </div>
      <div className="control">
        <button className="button is-info" onClick={AddMessage}>
          Enviar
        </button>
      </div>
    </div>
  );
}
