import styles from "../styles/sidebar.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useGetUsersQuery } from "../features/chat/chatApiSlice";
import {
  allUsers,
  setSelectedUser,
  setUsers,
  targetUser,
} from "../features/chat/chatSlice";
import { Users } from "lucide-react";
import { useEffect } from "react";
import { getOnlineUsers } from "../features/auth/authSlice";
import placeholderImage from "../assets/placeholderImage.jpg";

const Sidebar = () => {
  const { data, isLoading: isUsersLoading } = useGetUsersQuery();

  const users = useSelector(allUsers);
  const selectedUser = useSelector(targetUser);
  const onlineUsers = useSelector(getOnlineUsers);

  const dispatch = useDispatch();

  //TODO: bring a skeleton here later

  useEffect(() => {
    if (data) {
      dispatch(setUsers(data));
    }
  }, [data, dispatch]);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <Users className={styles.icon} />
          <span className={styles.title}>Contacts</span>
        </div>
      </div>

      <div className={styles.userList}>
        {!isUsersLoading &&
          users.map((user) => (
            <button
              key={user._id}
              onClick={() => dispatch(setSelectedUser(user))}
              className={`${styles.userButton} ${selectedUser?._id === user._id ? styles.selected : ""}`}
            >
              <div className={styles.avatarWrapper}>
                <img
                  src={user.profilePic || placeholderImage}
                  alt={user.name}
                  className={styles.avatar}
                />
                {onlineUsers.includes(user._id) && (
                  <span className={styles.onlineIndicator} />
                )}
              </div>
              <div className={styles.userInfo}>
                <div className={styles.userName}>{user.fullName}</div>
                <div className={styles.userStatus}>
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))}

        {isUsersLoading && <div>Loading...</div>}

        {!isUsersLoading && users.length === 0 && (
          <div className={styles.noUsers}>No online users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
