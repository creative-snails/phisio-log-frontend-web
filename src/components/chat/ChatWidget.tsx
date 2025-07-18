import { useEffect, useRef, useState } from "react";
import { FaUserDoctor } from "react-icons/fa6";
import { MdChat } from "react-icons/md";
import { SlArrowDown } from "react-icons/sl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ChatForm from "./ChatForm";

import "./ChatWidget.css";
import { type ChatHistoryType, type HealthRecord } from "~/types";

const ChatWidget = ({ healthRecordId }: { healthRecordId?: number }) => {
  const [healthRecord, setHealthRecord] = useState<HealthRecord | null>(null);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryType[]>([
    { role: "assistant", message: "Hello 👋!!!\nI'm your PhisioLog Assistant. How can I help you today?" },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [isChatEnabled, setIsChatEnabled] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showChatPopup && healthRecordId !== undefined && healthRecordId > 0 && !healthRecord) {
      const fetchRecord = async () => {
        setIsThinking(true);
        try {
          const res = await fetch(`http://localhost:4444/health-records/${healthRecordId}`);
          if (!res.ok) throw new Error("Failed to fetch health record");
          const data = await res.json();
          setHealthRecord(data);
          setChatHistory([
            {
              role: "assistant",
              message: `I see you're working with **${data.title}** record. How can I help you update it?`,
            },
          ]);
        } catch (error) {
          console.error("Error fetching health record:", error);
          setChatHistory((prev) => [
            ...prev,
            {
              role: "assistant",
              message:
                "Hmm, I'm unable to read your health record just now. \nPlease check your connection and try again, or let me know if you'd like to troubleshoot together.",
            },
          ]);
          setHealthRecord(null);
        } finally {
          setIsThinking(false);
        }
      };
      fetchRecord();
    }
  }, [showChatPopup, healthRecordId]);

  useEffect(() => {
    if (!chatBodyRef.current) return;
    // Scroll to the bottom of the chat body when chat history changes
    chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
  }, [chatHistory, showChatPopup]);

  useEffect(() => {
    if (!showChatPopup) return;
    if (healthRecordId && healthRecordId > 0) {
      localStorage.setItem("chat_session_record", JSON.stringify(chatHistory));
    } else {
      localStorage.setItem("chat_session_general", JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

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
            <div className="chat-logo-text">PhisioLog</div>
          </div>
          <button onClick={() => setShowChatPopup((prev) => !prev)}>
            <SlArrowDown />
          </button>
        </div>

        {/* Chat Body */}
        {isChatEnabled || healthRecordId ? (
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
        ) : (
          <div className="chat-body-onboarding">
            <div className="chat-body-onboarding-section">
              <button onClick={() => setIsChatEnabled(true)}>Start New Chat</button>
              <p className="chat-onboarding-btn-subtext">Begin a new conversation with your PhisioLog Assistant.</p>
            </div>
            <div className="chat-body-onboarding-section">
              <button onClick={() => setIsChatEnabled(true)}>Continue Chat</button>
              <p className="chat-onboarding-btn-subtext">Pick up from where you left off in your last session.</p>
            </div>
          </div>
        )}

        {/* Chat Footer */}
        <div className="chat-footer">
          <ChatForm
            setChatHistory={setChatHistory}
            setIsThinking={setIsThinking}
            disabled={!isChatEnabled && healthRecordId == null}
            showChatPopup={showChatPopup}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
