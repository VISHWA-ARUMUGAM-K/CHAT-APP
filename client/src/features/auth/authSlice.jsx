import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

// const BASE_URL = "http://localhost:3500/";
const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3500" : "/";
let newsocket = null;

const userInformation = localStorage.getItem("userInfo");
const initialState = {
  userInfo: userInformation ? JSON.parse(userInformation) : null,
  onlineUsers: [],
  token: null,
  socket: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token: accessToken, data } = action.payload;
      state.userInfo = data.user;
      state.token = accessToken;
      // localStorage.setItem("userInfo", JSON.stringify(data.user));
    },
    setAuthUser: (state, action) => {
      const data = action.payload;
      state.userInfo = data;
      // localStorage.setItem("userInfo", JSON.stringify(data.user));
    },
    logOut: (state) => {
      state.userInfo = null;
      state.token = null;
      localStorage.removeItem("userInfo");
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setCredentials, logOut, setOnlineUsers, setAuthUser } =
  authSlice.actions;
export { newsocket };
export default authSlice.reducer;

export const connectSocket = (payload) => (dispatch, getState) => {
  const state = getState();
  const authUser = state.auth.userInfo;
  const socket = state.auth.socket;

  if (!authUser || socket?.connected) return;

  newsocket = io(BASE_URL, { query: { userId: authUser._id } });
  newsocket.connect();

  newsocket.on("getOnlineUsers", (userIds) => {
    dispatch(setOnlineUsers(userIds));
  });

  //TODO: need to check this when using logout
  // dispatch(setSocket(newSocket));
};
export const disconnectSocket = (payload) => (dispatch, getState) => {
  // const state = getState();
  // const socket = state.auth.socket;
  //TODO: need to check this when using logout
  if (newsocket?.connected) newsocket.disconnect();
};

export const selectCurrentToken = (state) => state.auth.token;
export const getUser = (state) => state.auth.userInfo;
export const getOnlineUsers = (state) => state.auth.onlineUsers;
