import { useEffect, useRef, useState } from "react";
import { FaUserDoctor } from "react-icons/fa6";
import { MdChat } from "react-icons/md";
import { SlArrowDown } from "react-icons/sl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ChatForm from "./ChatForm";

import "./ChatWidget.css";
import type { ChatHistoryType } from "~/types";

const ChatWidget = () => {
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryType[]>([
    { role: "assistant", message: "Hello 👋!!!\nI'm your PhisioLog Assistant. How can I help you today?" },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatBodyRef.current) return;
    // Scroll to the bottom of the chat body when chat history changes
    chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
  }, [chatHistory, showChatPopup]);

  return (
    <div className={showChatPopup ? "chat-show-popup" : ""}>
      <button onClick={() => setShowChatPopup((prev) => !prev)} id="chat-popup-toggler">
        <MdChat className="chat-bubble" />
      </button>
      <div className="chat-popup">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-header-info">
            <FaUserDoctor className="chat-logo-icon" /> {/* placeholder logo */}
            <h2 className="chat-logo-text">PhisioLog</h2>
          </div>
          <button onClick={() => setShowChatPopup((prev) => !prev)}>
            <SlArrowDown />
          </button>
        </div>

        {/* Chat Body */}
        <div ref={chatBodyRef} className="chat-body">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`chat-message chat-${chat.role}-message`}>
              {chat.role === "assistant" && <FaUserDoctor className="chat-logo-icon" />}
              <div className="chat-message-text">
                <ReactMarkdown
                  components={{ a: ({ ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" /> }}
                  remarkPlugins={[remarkGfm]}
                >
                  {chat.message}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="chat-message chat-assistant-message">
              <FaUserDoctor className="chat-logo-icon" />
              <div className="chat-message-text chat-thinking-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
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
