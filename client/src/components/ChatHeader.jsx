import { X } from "lucide-react";

import "../styles/chatHeader.scss";
import { setSelectedUser, targetUser } from "../features/chat/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { getOnlineUsers } from "../features/auth/authSlice";
import placeholderImage from "../assets/placeholderImage.jpg";

const ChatHeader = () => {
  const selectedUser = useSelector(targetUser);
  const onlineUsers = useSelector(getOnlineUsers);
  const dispatch = useDispatch();

  return (
    <div
      className="chat-header"
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <div className="user-info">
        <div className="avatar">
          <img
            src={selectedUser.profilePic || placeholderImage}
            alt={selectedUser.fullName}
          />
        </div>

        {/* User info */}
        <div className="details">
          <h3>{selectedUser.fullName}</h3>
          <p>{onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}</p>
        </div>
      </div>

      {/* Close button */}
      <button
        className="close-btn"
        onClick={() => dispatch(setSelectedUser(null))}
      >
        <X />
      </button>
    </div>
  );
};

export default ChatHeader;
