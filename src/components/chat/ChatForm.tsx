import { type Dispatch, type FormEvent, type SetStateAction, useEffect, useRef } from "react";
import { IoMdArrowUp } from "react-icons/io";
import { getAssistantResponse } from "./mockChatService";

import type { ChatHistoryType } from "~/types";

interface ChatFormProps {
  chatHistory: ChatHistoryType;
  setChatHistory: Dispatch<SetStateAction<ChatHistoryType>>;
  setIsThinking: Dispatch<SetStateAction<boolean>>;
  showChatWidget: boolean;
}

const ChatForm = ({ chatHistory, setChatHistory, setIsThinking, showChatWidget }: ChatFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [showChatWidget, chatHistory]);

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputRef.current?.value) return;
    const userMessage = inputRef.current.value.trim();
    inputRef.current.value = "";

    setChatHistory((prev) => ({
      id: prev?.id,
      history: [...(prev?.history || []), { role: "user", message: userMessage }],
    }));

    setIsThinking(true);

    // Get assistant response with simulated delay
    setTimeout(() => {
      setChatHistory((prev) => ({
        id: prev?.id,
        history: [...(prev?.history || []), { role: "assistant", message: getAssistantResponse(userMessage) }],
      }));
      setIsThinking(false);
    }, 2000);
  };

  return (
    <form className="chat-form" onSubmit={handleSendMessage}>
      <input ref={inputRef} type="text" placeholder="Message..." className="chat-message-input" required />
      <button>
        <IoMdArrowUp className="chat-btn-arrow" />
      </button>
    </form>
  );
};

export default ChatForm;
