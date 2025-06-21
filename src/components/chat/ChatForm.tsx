import { IoMdArrowUp } from "react-icons/io";

const ChatForm = () => {
  return (
    <form action="#" className="chat-form">
      <input type="text" placeholder="Message..." className="message-input" required />
      <button>
        <IoMdArrowUp className="btn-arrow" />
      </button>
    </form>
  );
};

export default ChatForm;
