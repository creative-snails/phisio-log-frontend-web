import { type Dispatch, type SetStateAction, useRef } from "react";
import { IoMdArrowUp } from "react-icons/io";

import type { ChatHistoryType } from "~/types";

const ChatForm = ({ setChatHistory }: { setChatHistory: Dispatch<SetStateAction<ChatHistoryType[]>> }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputRef.current?.value) return;

    const userMessage = inputRef.current.value.trim();

    inputRef.current.value = "";
    inputRef.current.focus();
    setChatHistory((history: ChatHistoryType[]) => [...history, { role: "user", message: userMessage }]);
  };

  return (
    <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
      <input ref={inputRef} type="text" placeholder="Message..." className="message-input" required />
      <button>
        <IoMdArrowUp className="btn-arrow" />
      </button>
    </form>
  );
};

export default ChatForm;
