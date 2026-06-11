/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "../api/baseApi";


interface JourneyPart {
  id: string;
  partNumber: number;
  title?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  lessons?: JourneyLesson[];
}

interface JourneyLesson {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  partId: string;
  createdAt: string;
  updatedAt: string;
}

export const journeyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Parts
    getAllParts: builder.query<JourneyPart[], void>({
      query: () => "/journey/parts",
      transformResponse: (response: any) => response.data,
      providesTags: ["JourneyPart", "JourneyLesson"],
    }),
    getPartById: builder.query<JourneyPart, string>({
      query: (id) => `/journey/parts/${id}`,
      transformResponse: (response: any) => response.data,
      providesTags: (_result, _error, id) => [{ type: "JourneyPart", id }],
    }),
    createPart: builder.mutation<JourneyPart, FormData>({
      query: (formData) => ({
        url: "/journey/parts",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["JourneyPart", "JourneyLesson"],
    }),
    updatePart: builder.mutation<JourneyPart, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/journey/parts/${id}`,
        method: "PATCH",
        body: formData,
      }),
       invalidatesTags: ["JourneyPart", "JourneyLesson"],
    }),
    deletePart: builder.mutation<void, string>({
      query: (id) => ({
        url: `/journey/parts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["JourneyPart", "JourneyLesson"],
    }),

    // Lessons
    getLessonsByPart: builder.query<JourneyLesson[], string>({
      query: (partId) => `/journey/parts/${partId}/lessons`,
      transformResponse: (response: any) => response.data,
      providesTags: (_result, _error, partId) => [{ type: "JourneyLesson", id: partId }],
    }),
    createLesson: builder.mutation<JourneyLesson, FormData>({
      query: (formData) => ({
        url: "/journey/lessons",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["JourneyPart", "JourneyLesson"],
    }),
    updateLesson: builder.mutation<JourneyLesson, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/journey/lessons/${id}`,
        method: "PATCH",
        body: formData,
      }),
     invalidatesTags: ["JourneyPart", "JourneyLesson"],
    }),
    deleteLesson: builder.mutation<void, string>({
      query: (id) => ({
        url: `/journey/lessons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["JourneyPart", "JourneyLesson"],
    }),
  }),
});

export const {
  useGetAllPartsQuery,
  useGetPartByIdQuery,
  useCreatePartMutation,
  useUpdatePartMutation,
  useDeletePartMutation,
  useGetLessonsByPartQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} = journeyApi;