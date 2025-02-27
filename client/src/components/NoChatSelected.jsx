import styles from "../styles/nochatselected.module.scss";
import { MessagesSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Icon Display */}
        <div className={styles.iconWrapper}>
          <div className={styles.iconContainer}>
            <div>
              <MessagesSquare />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className={styles.title}>Start Chatting!</h2>
        <p className={styles.subtitle}>
          Select a conversation from the sidebar to start chatting.
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
