import { apiSlice } from "../../app/api/apiSlice";
import { setMessages } from "./chatSlice";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: "api/v1/messages/users",
      }),
    }),

    getMessages: builder.query({
      query: (userId) => ({
        url: `api/v1/messages/${userId}`,
      }),
    }),

    sendMessage: builder.mutation({
      query: ({ text, image, selectedUserId }) => ({
        url: `/api/v1/messages/send/${selectedUserId}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { text, image },
      }),
      async onQueryStarted(
        // { text, image },
        { dispatch, queryFulfilled, getState },
      ) {
        try {
          // Optimistic update
          const state = getState();
          const messages = state.chat.messages;
          // const message = { text, image };

          //TODO: ADD OPTIMISTIC UPDATE AFTER SOMETIME

          // Add message locally before server response
          // dispatch(
          //   setMessages([
          //     ...messages,
          //     { text: message, sender: "me", temp: true },
          //   ]),
          // );

          const { data } = await queryFulfilled;

          // Update messages with actual response from server
          dispatch(setMessages([...messages, data.message]));
        } catch (error) {
          console.error("Error sending message:", error);
        }
      },
    }),
  }),
});

export const { useGetUsersQuery, useGetMessagesQuery, useSendMessageMutation } =
  chatApiSlice;
