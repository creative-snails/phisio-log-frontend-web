import { useState } from "react";
import { FaUserDoctor } from "react-icons/fa6";
import { MdChat } from "react-icons/md";
import { SlArrowDown } from "react-icons/sl";
import ChatForm from "./ChatForm";

import "./ChatWidget.css";
import type { ChatHistoryType } from "~/types";

const ChatWidget = () => {
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryType[]>([
    { role: "assistant", message: " Hey there!!!\n How can I help you today?" },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  return (
    <div className={showChatPopup ? "show-chat-popup" : ""}>
      <button onClick={() => setShowChatPopup((prev) => !prev)} id="chat-popup-toggler">
        <MdChat className="chat-bubble" />
      </button>
      <div className="chat-popup">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="header-info">
            <FaUserDoctor className="logo-icon" /> {/* placeholder logo */}
            <h2 className="logo-text">PhisioLog</h2>
          </div>
          <button onClick={() => setShowChatPopup((prev) => !prev)}>
            <SlArrowDown />
          </button>
        </div>

        {/* Chat Body */}
        <div className="chat-body">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`message ${chat.role}-message`}>
              {chat.role === "assistant" && <FaUserDoctor className="logo-icon" />}
              <p className="message-text">{chat.message}</p>
            </div>
          ))}
          {isTyping && (
            <div className="message assistant-message typing">
              <FaUserDoctor className="logo-icon" />
              <p className="message-text">typing...</p>
            </div>
          )}
        </div>

        {/* Chat Footer */}
        <div className="chat-footer">
          <ChatForm setChatHistory={setChatHistory} setIsTyping={setIsTyping} />
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
