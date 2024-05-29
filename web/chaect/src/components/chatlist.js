import ChatItem from "./chatitem";

export default function ChatList({ messages }) {
  return (
    <div className="block">
      {messages.map((message, i) => (
        <ChatItem key={i}>
          {message}
        </ChatItem>
      ))}
    </div>
  );
}
