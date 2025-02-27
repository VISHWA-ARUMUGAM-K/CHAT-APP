import { useRef, useState } from "react";
import { useSendMessageMutation } from "../features/chat/chatApiSlice";
import styles from "../styles/messageinput.module.scss";
import { Send, X } from "lucide-react";
import { useSelector } from "react-redux";
import { targetUser } from "../features/chat/chatSlice";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const selectedUser = useSelector(targetUser);

  const [sendMessage] = useSendMessageMutation();

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
        selectedUserId: selectedUser._id,
      }).unwrap();
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("failed to send message", error);
    }
  };

  return (
    <div className={styles.messageInputContainer}>
      <form onSubmit={handleSendMessage} className={styles.messageForm}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            className={styles.textInput}
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className={styles.sendButton}
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
