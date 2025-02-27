import { createSlice } from "@reduxjs/toolkit";
import { newsocket } from "../auth/authSlice";

const initialState = {
  messages: [],
  users: [],
  selectedUser: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = [...action.payload];
    },
    setMessages: (state, action) => {
      const messagedata = action.payload;
      state.messages = messagedata;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    // subscribeToMessage:(state)=>{
    //   if(!state.selectedUser) return
    // }
  },
});

export const { setUsers, setMessages, setSelectedUser } = chatSlice.actions;

export default chatSlice.reducer;

export const subscribeToMessages = () => (dispatch, getState) => {
  const state = getState();
  const selectedUser = state.chat.selectedUser;
  const messages = state.chat.messages;

  if (!selectedUser) return;
  const socket = newsocket;

  socket.on("newMessage", (newMessage) => {
    dispatch(setMessages([...messages, newMessage]));
  });
};

export const subscribeToMessagescheck = (selectedUser, messages, dispatch) => {
  if (!selectedUser) return;
  const socket = newsocket;

  socket.on("newMessage", (newMessage) => {
    if (newMessage.senderId != selectedUser._id) return;
    dispatch(setMessages([...messages, newMessage]));
  });
};

export const unSubscribeToMessage = () => (dispatch, getState) => {
  const socket = newsocket;
  socket.off("newMessage");
};

export const unSubscribeToMessageCheck = () => {
  const socket = newsocket;
  socket.off("newMessage");
};
export const targetUser = (state) => state.chat.selectedUser;
export const allUsers = (state) => state.chat.users;
export const getmessages = (state) => state.chat.messages;
