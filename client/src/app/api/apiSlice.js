import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrlLink =
  import.meta.env.MODE === "development" ? "http://localhost:3500" : "/";

const baseQuery = fetchBaseQuery({
  baseUrl: baseUrlLink,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
export const apiSlice = createApi({
  baseQuery,
  //eslint-disable-next-line
  endpoints: (builder) => ({}),
});

// const baseQuery = fetchBaseQuery({
//   baseUrl: "http://localhost:3500",
//   credentials: "include",
//   prepareHeaders: (headers, { getState }) => {
//     const token = getState().auth.token;
//
//     if (token) {
//       headers.set("authorization", `Bearer ${token}`);
//     }
//     return headers;
//   },
// });
// export const apiSlice = createApi({
//   baseQuery,
//   //eslint-disable-next-line
//   endpoints: (builder) => ({}),
// });
