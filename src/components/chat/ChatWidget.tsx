import { useEffect, useRef, useState } from "react";
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
  const [isThinking, setIsThinking] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatBodyRef.current) return;
    // Scroll to the bottom of the chat body when chat history changes
    chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
  }, [chatHistory]);

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
        <div ref={chatBodyRef} className="chat-body">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`message ${chat.role}-message`}>
              {chat.role === "assistant" && <FaUserDoctor className="logo-icon" />}
              <p className="message-text">{chat.message}</p>
            </div>
          ))}
          {isThinking && (
            <div className="message assistant-message">
              <FaUserDoctor className="logo-icon" />
              <p className="message-text thinking-dots">
                <span></span>
                <span></span>
                <span></span>
              </p>
            </div>
          )}
        </div>

        {/* Chat Footer */}
        <div className="chat-footer">
          <ChatForm setChatHistory={setChatHistory} setIsThinking={setIsThinking} />
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
