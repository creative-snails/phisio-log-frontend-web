import { useEffect, useMemo, useRef, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { FaUserDoctor } from "react-icons/fa6";
import { MdChat } from "react-icons/md";
import { SlArrowDown } from "react-icons/sl";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom"; // Add this import
import remarkGfm from "remark-gfm";
import ChatForm from "./ChatForm";

import "./ChatWidget.css";
import { getHealthRecord } from "~/services/api/healthRecordsApi";
import { type ChatHistoryType, type HealthRecord } from "~/types";

const ChatWidget = ({ healthRecordId }: { healthRecordId?: string }) => {
  const navigate = useNavigate(); // Add this hook
  const [healthRecord, setHealthRecord] = useState<HealthRecord | null>(null);
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryType>({
    id: undefined,
    history: [],
  });
  const [isThinking, setIsThinking] = useState(false);
  const [showContextButtons, setShowContextButtons] = useState(false);

  const chatBodyRef = useRef<HTMLDivElement>(null);

  const isValidRecordId = useMemo(() => {
    return Boolean(healthRecordId?.trim());
  }, [healthRecordId]);

  // Health record fetching
  const fetchHealthRecord = async (id: string | undefined) => {
    if (!id) return;
    setIsThinking(true);
    try {
      const record = await getHealthRecord(id);

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

  const initializeChat = async (continueChat = false) => {
    const existingChatSession = localStorage.getItem("chat_history");

    // Chat session exists
    if (existingChatSession) {
      let parsedChatHistory: ChatHistoryType | null = null;

      try {
        parsedChatHistory = JSON.parse(existingChatSession);

        if (!parsedChatHistory || !Array.isArray(parsedChatHistory.history)) {
          throw new Error("Invalid chat history structure");
        }
      } catch (error) {
        console.error("Failed to parse chat session:", error);
        localStorage.removeItem("chat_history");
        initializeChat();

        return;
      }

      setChatHistory(parsedChatHistory);

      // Within the same context
      if (parsedChatHistory.id === healthRecordId) {
        setShowContextButtons(false);
        setHealthRecord((await fetchHealthRecord(healthRecordId)) || null);

        // Within different context
      } else {
        // Continue previous discussion
        if (continueChat) {
          setShowContextButtons(false);
          // Previous discussion is record related (non general chat)
          if (parsedChatHistory.id) {
            const confirm = window.confirm(
              `This will take you to the ${healthRecord?.title || "previous"} record page. Continue?`
            );
            if (!confirm) {
              setShowContextButtons(true);

              return;
            }
            navigate(`/health-record/${parsedChatHistory.id}/edit`);
          }

          return;
        }
        setHealthRecord((await fetchHealthRecord(parsedChatHistory.id)) || null);
        setShowContextButtons(true);
      }

      // No chat session (fresh start)
    } else {
      if (isValidRecordId) {
        const record = await fetchHealthRecord(healthRecordId);
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

  // Initialize chat effect
  useEffect(() => {
    if (!showChatWidget) return;
    initializeChat();
  }, [showChatWidget]);

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
    setHealthRecord(null);
    setShowContextButtons(false);
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
          <div>{`${healthRecord?.title ?? "General Chat"}`}</div>
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
            <div className="message">Your chat focus doesn’t match the page you’re on. Would you like to:</div>
            <div className="chat-context-buttons">
              <button
                onClick={() => {
                  initializeChat(true);
                }}
              >
                Continue with {healthRecord?.title ? healthRecord?.title : "General Chat"}
              </button>
              <button onClick={handleResetChat}>Switch Focus</button>
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
