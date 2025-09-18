import { useEffect, useMemo, useRef, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { FaUserDoctor } from "react-icons/fa6";
import { MdChat } from "react-icons/md";
import { SlArrowDown } from "react-icons/sl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ChatForm from "./ChatForm";

import "./ChatWidget.css";
import { getHealthRecord } from "~/services/api/healthRecordsApi";
import { type ChatHistoryType, type HealthRecord } from "~/types";

const ChatWidget = ({ healthRecordId }: { healthRecordId?: string }) => {
  const [healthRecord, setHealthRecord] = useState<HealthRecord | null>(null);
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryType>({
    id: undefined,
    history: [],
  });
  const [isThinking, setIsThinking] = useState(false);
  const [showContextButtons, setShowContextButtons] = useState(false);

  const chatBodyRef = useRef<HTMLDivElement>(null);

  const isValidRecordId = useMemo(() => healthRecordId !== undefined && healthRecordId.trim() !== "", [healthRecordId]);

  // Health record fetching
  const fetchHealthRecord = async () => {
    setIsThinking(true);
    try {
      const record = await getHealthRecord(healthRecordId!);

      return record;
    } catch (error) {
      console.error("Error fetching health record:", error);
      setChatHistory((prev) => ({
        id: prev?.id,
        history: [
          ...(prev?.history || []),
          {
            role: "assistant",
            message:
              "Hmm, I'm unable to read your health record just now. \nPlease check your connection and try again, or let me know if you'd like to troubleshoot together.",
          },
        ],
      }));
      setHealthRecord(null);
    } finally {
      setIsThinking(false);
    }
  };

  const initializeChat = async () => {
    const existingChatSession = localStorage.getItem("chat_history");

    // CHAT SESSION EXISTS
    if (existingChatSession) {
      const parsedChatHistory: ChatHistoryType = JSON.parse(existingChatSession);

      // If context has changed (e.g. user opens chat within different health record that the one in session) -> show buttons and load chat history, otherwise just load chat history
      if (parsedChatHistory.id !== healthRecordId) setShowContextButtons(true);
      setChatHistory(parsedChatHistory);
      // NO CHAT SESSION
    } else {
      if (isValidRecordId) {
        const record = healthRecord || (await fetchHealthRecord());
        setHealthRecord(record || null);
        if (record) {
          setChatHistory({
            id: healthRecordId,
            history: [
              {
                role: "assistant",
                message: `I see you're working with **${record.title}** record. How can I help you update it?`,
              },
            ],
          });
        }
      } else {
        setChatHistory({
          history: [
            { role: "assistant", message: "Hello 👋!!!\nI'm your PhisioLog Assistant. How can I help you today?" },
          ],
        });
      }
    }
  };

  // Chat initialization
  useEffect(() => {
    if (!showChatWidget) return;
    initializeChat();
  }, [showChatWidget, healthRecordId]);

  // Scroll to the bottom of the chat body
  useEffect(() => {
    if (!chatBodyRef.current) return;
    chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
  }, [chatHistory, showChatWidget]);

  // Save chat history to localStorage
  useEffect(() => {
    if (showChatWidget && chatHistory && chatHistory.history.length > 0) {
      try {
        localStorage.setItem("chat_history", JSON.stringify(chatHistory));
      } catch (error) {
        console.error("Failed to save chat session:", error);
      }
    }
  }, [chatHistory]);

  const handleResetChat = async () => {
    const confirm = window.confirm("Do you want to start fresh? This will clear your current chat history.");
    if (!confirm) return;
    localStorage.removeItem("chat_history");
    initializeChat();
  };

  return (
    <div className={showChatWidget ? "chat-show-widget" : ""}>
      <button onClick={() => setShowChatWidget((prev) => !prev)} id="chat-widget-toggler">
        <MdChat className="chat-bubble" />
      </button>
      <div className="chat-widget">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-header-info">
            <FaUserDoctor className="chat-logo-icon" /> {/* placeholder logo */}
            <div className="chat-logo-text">PhisioLog</div>
          </div>
          <button className="chat-reset-btn" onClick={handleResetChat} title="Reset Chat">
            <BsTrash />
          </button>
          <button onClick={() => setShowChatWidget((prev) => !prev)} title="Close Chat">
            <SlArrowDown />
          </button>
        </div>

        {/* Chat Body */}
        <div className="chat-context-indicator">
          <div>{`Context: ${healthRecord?.title ?? "General"}`}</div>
        </div>
        <div ref={chatBodyRef} className="chat-body">
          {chatHistory?.history.map((chat, index) => (
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
        {showContextButtons ? (
          <div className="chat-context-section">
            <div className="message">
              I see you’re now viewing your Back Pain record. Would you like to switch focus to this, or continue where
              we left off?
            </div>
            <div className="chat-context-buttons">
              <button onClick={() => setShowContextButtons(false)}>Continue Chat</button>
              <button>Switch to Back Pain</button>
            </div>
          </div>
        ) : (
          <div className="chat-input-form">
            <ChatForm
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              setIsThinking={setIsThinking}
              showChatWidget={showChatWidget}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWidget;
