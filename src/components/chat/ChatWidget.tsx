import { useEffect, useMemo, useRef, useState } from "react";
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
  const [chatHistory, setChatHistory] = useState<ChatHistoryType[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const chatBodyRef = useRef<HTMLDivElement>(null);

  const isValidRecordId = useMemo(() => healthRecordId !== undefined && healthRecordId >= 0, [healthRecordId]);
  const sessionKey = useMemo(
    () => (isValidRecordId ? `chat-session-record-${healthRecordId}` : "chat-session-general"),
    [healthRecordId]
  );

  // Health record fetching
  const fetchHealthRecord = async () => {
    setIsThinking(true);
    try {
      const res = await fetch(`http://localhost:4444/health-records/${healthRecordId}`);
      if (!res.ok) throw new Error("Failed to fetch health record");
      const data = await res.json();
      setHealthRecord(data);

      return data;
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

  // Chat initialization
  useEffect(() => {
    if (!showChatPopup) return;

    const initializeChat = async () => {
      const existingChatSession = localStorage.getItem(sessionKey);

      if (isValidRecordId && !healthRecord && !existingChatSession) {
        const record = await fetchHealthRecord();
        if (record) {
          setChatHistory([
            {
              role: "assistant",
              message: `I see you're working with **${record.title}** record. How can I help you update it?`,
            },
          ]);
        }
      } else if (!isValidRecordId && !existingChatSession) {
        setChatHistory([
          { role: "assistant", message: "Hello 👋!!!\nI'm your PhisioLog Assistant. How can I help you today?" },
        ]);
      }
    };

    initializeChat();
  }, [showChatPopup, healthRecordId]);

  // Scroll to the bottom of the chat body
  useEffect(() => {
    if (!chatBodyRef.current) return;
    chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
  }, [chatHistory, showChatPopup]);

  // Save chat history to localStorage
  useEffect(() => {
    if (showChatPopup && chatHistory.length > 0) {
      try {
        localStorage.setItem(sessionKey, JSON.stringify(chatHistory));
      } catch (error) {
        console.error("Failed to save chat session:", error);
      }
    }
  }, [chatHistory]);

  const handleNewChat = async () => {
    const confirm = window.confirm(
      "Starting a new chat will erase your previous chat session! Do you want to continue?"
    );
    if (!confirm) return;
    localStorage.removeItem(sessionKey);

    if (isValidRecordId) {
      const record = healthRecord || (await fetchHealthRecord());
      if (record) {
        setChatHistory([
          {
            role: "assistant",
            message: `I see you're working with **${record.title}** record. How can I help you update it?`,
          },
        ]);
      }
    } else {
      setChatHistory([
        { role: "assistant", message: "Hello 👋!!!\nI'm your PhisioLog Assistant. How can I help you today?" },
      ]);
    }
  };

  const handleContinueChat = () => {
    try {
      const savedSession = localStorage.getItem(sessionKey);
      if (savedSession) {
        const parsedChatHistory = JSON.parse(savedSession);
        setChatHistory(parsedChatHistory);
      }
    } catch (error) {
      console.error("Failed to load chat session:", error);
      setChatHistory([
        { role: "assistant", message: "I couldn't retrieve your previous conversation! Let's start a new chat!" },
      ]);
    }
  };

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
        {chatHistory.length > 0 ? (
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
              <button onClick={handleContinueChat}>Continue Chat</button>
              <p className="chat-onboarding-btn-subtext">Pick up from where you left off in your last session.</p>
            </div>
            <div className="chat-body-onboarding-section">
              <button onClick={handleNewChat}>Start New Chat</button>
              <p className="chat-onboarding-btn-subtext">Begin a new conversation with your PhisioLog Assistant.</p>
            </div>
          </div>
        )}

        {/* Chat Footer */}
        <div className="chat-footer">
          <ChatForm
            setChatHistory={setChatHistory}
            setIsThinking={setIsThinking}
            disabled={chatHistory.length === 0}
            showChatPopup={showChatPopup}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
