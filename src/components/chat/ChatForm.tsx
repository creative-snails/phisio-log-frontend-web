import React, { useRef } from "react";
import { IoMdArrowUp } from "react-icons/io";

const ChatForm = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputRef.current?.value) return;

    const userMessage = inputRef.current.value.trim();

    inputRef.current.value = "";
    inputRef.current.focus();
    console.log(userMessage);
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
