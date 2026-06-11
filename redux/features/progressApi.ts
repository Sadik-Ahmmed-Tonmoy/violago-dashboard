/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../api/baseApi";

export interface ProgressEntry {
  id: string;
  userName: string;
  avatarUrl: string;
  lessonName: string;
  completed: number;
  total: number;
  lastActivity: string;
  status: 'Just started' | 'On track' | 'Completed';
}

interface ProgressResponse {
  data: ProgressEntry[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const progressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProgressViewer: builder.query<ProgressResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => `/progress/viewer?page=${page}&limit=${limit}`,
      transformResponse: (response: any) => response.data,
      providesTags: ["Progress"],
    }),
  }),
});

export const { useGetProgressViewerQuery } = progressApi;