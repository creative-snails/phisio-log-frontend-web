import { type Dispatch, type FormEvent, type SetStateAction, useRef } from "react";
import { IoMdArrowUp } from "react-icons/io";
import { getAssistantResponse } from "./mockChatService";

import type { ChatHistoryType } from "~/types";

const ChatForm = ({ setChatHistory }: { setChatHistory: Dispatch<SetStateAction<ChatHistoryType[]>> }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputRef.current?.value) return;

    const userMessage = inputRef.current.value.trim();

    inputRef.current.value = "";
    inputRef.current.focus();
    setChatHistory((history: ChatHistoryType[]) => [...history, { role: "user", message: userMessage }]);
    setChatHistory((history: ChatHistoryType[]) => [
      ...history,
      { role: "assistant", message: getAssistantResponse() },
    ]);
  };

  return (
    <form action="#" className="chat-form" onSubmit={handleSendMessage}>
      <input ref={inputRef} type="text" placeholder="Message..." className="message-input" required />
      <button>
        <IoMdArrowUp className="btn-arrow" />
      </button>
    </form>
  );
};

export default ChatForm;
