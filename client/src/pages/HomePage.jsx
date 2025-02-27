import { useSelector } from "react-redux";
import { targetUser } from "../features/chat/chatSlice";
import "../styles/homepage.scss";
import Sidebar from "../components/SideBar.jsx";
import NoChatSelected from "../components/NoChatSelected.jsx";
import ChatContainer from "../components/ChatContainer.jsx";

const HomePage = () => {
  const selectedUser = useSelector(targetUser);

  return (
    <div className="home-container">
      <div className="content-wrapper">
        <Sidebar />
        <div className="chat-container">
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
