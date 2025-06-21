import { useState } from "react";
import { FaUserDoctor } from "react-icons/fa6";
import { MdChat } from "react-icons/md";
import { SlArrowDown } from "react-icons/sl";
import ChatForm from "./ChatForm";

import "./ChatWidget.css";

const ChatWidget = () => {
  const [showChatPopup, setShowChatPopup] = useState(false);

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
          <div className="message bot-message">
            <FaUserDoctor className="logo-icon" />
            <p className="message-text">
              Hey there!!! <br /> How can I help you today?
            </p>
          </div>
          <div className="message user-message">
            <p className="message-text">Great, thanks for asking. Who am I chatting with?</p>
          </div>
        </div>

        {/* Chat Footer */}
        <div className="chat-footer">
          <ChatForm />
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
