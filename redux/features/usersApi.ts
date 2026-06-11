/* eslint-disable @typescript-eslint/no-explicit-any */


import { baseApi } from "../api/baseApi";

const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUSers: builder.query({
      query: (params) => {
        console.log("Fetching users with params:", params);
        const searchParams = new URLSearchParams();
        searchParams.append('page', params.page.toString());
        searchParams.append('limit', params.limit.toString());
        return {
          url: `/users/all`,
          method: "GET",
          params: searchParams,
        };
      },
    }),
    getSingleUser: builder.query({
      query: (id) => ({
        url: `/users/single/${id}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),




    blockUnblockUser: builder.mutation({
      query: (data) => {
        return {
          url: `/users/block-unblock-user/${data?.id}`,
          method: "PATCH",
          body: data?.formData,
        };
      },
      invalidatesTags: ["user"],
    }),

  }),
});

export const {
  useGetAllUSersQuery,
  useGetSingleUserQuery,
  useBlockUnblockUserMutation,
} = usersApi;
