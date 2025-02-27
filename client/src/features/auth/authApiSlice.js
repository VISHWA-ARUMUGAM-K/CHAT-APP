import { apiSlice } from "../../app/api/apiSlice";
import {
  connectSocket,
  disconnectSocket,
  setCredentials,
  logOut,
  setAuthUser,
} from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signin: builder.mutation({
      query: (data) => ({
        url: "api/v1/auth/signin",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          dispatch(setCredentials(response));
          dispatch(connectSocket());
        } catch (error) {
          console.error("login failed", error);
        }
      },
    }),

    login: builder.mutation({
      query: (data) => ({
        url: "api/v1/auth/login",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          dispatch(setCredentials(response));
          dispatch(connectSocket());
        } catch (error) {
          console.error("login failed", error);
        }
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: "api/v1/auth/logout",
        method: "POST",
      }),

      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut());
          dispatch(disconnectSocket());
        } catch (error) {
          console.error("login failed", error);
        }
      },
    }),

    checkAuth: builder.query({
      query: () => ({
        url: "api/v1/auth/check",
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          dispatch(setAuthUser(response));
          dispatch(connectSocket());
        } catch (error) {
          console.error("login failed", error);
        }
      },
    }),
  }),
});

export const {
  useSigninMutation,
  useLoginMutation,
  useLogoutMutation,
  useCheckAuthQuery,
  useLazyCheckAuthQuery,
} = authApiSlice;
