import { type Dispatch, type FormEvent, type SetStateAction, useRef } from "react";
import { IoMdArrowUp } from "react-icons/io";
import { getAssistantResponse } from "./mockChatService";

import type { ChatHistoryType } from "~/types";

type ChatFormProps = {
  setChatHistory: Dispatch<SetStateAction<ChatHistoryType[]>>;
  setIsTyping: Dispatch<SetStateAction<boolean>>;
};

const ChatForm = ({ setChatHistory, setIsTyping }: ChatFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputRef.current?.value) return;

    const userMessage = inputRef.current.value.trim();

    inputRef.current.value = "";
    inputRef.current.focus();
    setChatHistory((history: ChatHistoryType[]) => [...history, { role: "user", message: userMessage }]);

    setIsTyping(true);

    setTimeout(() => {
      setChatHistory((history: ChatHistoryType[]) => [
        ...history,
        { role: "assistant", message: getAssistantResponse() },
      ]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <form className="chat-form" onSubmit={handleSendMessage}>
      <input ref={inputRef} type="text" placeholder="Message..." className="message-input" required />
      <button>
        <IoMdArrowUp className="btn-arrow" />
      </button>
    </form>
  );
};

export default ChatForm;
