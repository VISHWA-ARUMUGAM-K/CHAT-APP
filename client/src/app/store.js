import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.jsx";
import chatReducer from "../features/chat/chatSlice.js";
import { apiSlice } from "./api/apiSlice.js";

const allowed = import.meta.env.MODE === "development";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: allowed ? allowed : false,
});
