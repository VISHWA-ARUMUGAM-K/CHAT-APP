import { useDispatch, useSelector } from "react-redux";
import {
  getmessages,
  setMessages,
  subscribeToMessagescheck,
  targetUser,
  unSubscribeToMessageCheck,
} from "../features/chat/chatSlice";
import { useGetMessagesQuery } from "../features/chat/chatApiSlice";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import "../styles/chatcontainer.scss";
import { getUser } from "../features/auth/authSlice";
import { formatMessageTime } from "../lib/utils.js";

const ChatContainer = () => {
  const selectedUser = useSelector(targetUser);
  const authUser = useSelector(getUser);
  const messages = useSelector(getmessages);

  const messageEndRef = useRef(null);

  const {
    data,
    error,
    isLoading: isMessagesLoading,
  } = useGetMessagesQuery(selectedUser._id);

  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(setMessages(data));
    }
  }, [dispatch, data]);

  useEffect(() => {
    subscribeToMessagescheck(selectedUser, messages, dispatch);
    return () => unSubscribeToMessageCheck();
  }, [messages, dispatch, selectedUser._id, selectedUser]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="chat-container">
        <ChatHeader />
        <div>Loading...</div>
        <MessageInput />
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-container">
        <ChatHeader />
        some error
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="chat-container">
      <ChatHeader />

      <div className="messages">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat-item ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className="message-box" style={{ minWidth: "300px" }}>
              <div className="chat-header">
                <time>{formatMessageTime(message.createdAt)}</time>
              </div>
              <div className="chat-bubble">
                {message.image && <img src={message.image} alt="Attachment" />}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
