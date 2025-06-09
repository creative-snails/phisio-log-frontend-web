import { FaUserDoctor } from "react-icons/fa6";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";

import "./ChatWidget.css";

const ChatWidget = () => {
  return (
    <div className="container">
      <div className="chat-popup">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="header-info">
            <FaUserDoctor className="logo-icon" /> {/* placeholder logo */}
            <h2 className="logo-text">PhisioLog</h2>
          </div>
          <button>
            <SlArrowDown />
          </button>
        </div>

        {/* Chat Body */}
        <div className="chat-body">
          <div className="message bot-message">
            <FaUserDoctor />
            <p className="message-text">
              Hey there!!! <br /> How can I help you today?
            </p>
          </div>
          <div className="message bot-message">
            <p className="message-text">Great, thanks for asking. Who am I chatting with?</p>
          </div>
        </div>

        {/* Chat Footer */}
        <div className="chat-footer"></div>
        <form action="#" className="chat-form">
          <input type="text" placeholder="Message..." className="message-input" required />
          <button className="arrow">
            <SlArrowUp />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWidget;
