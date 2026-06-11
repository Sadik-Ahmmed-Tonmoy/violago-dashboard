/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../api/baseApi";

interface Category {
    id: string;
    name: string;
    iconUrl?: string;
    createdAt: string;
    updatedAt: string;
    lessons?: Lesson[];
}

interface Lesson {
    id: string;
    title: string;
    writerName?: string;
    description?: string;
    thumbnail?: string;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
    category?: Category;
}

export const lessonApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllCategories: builder.query<Category[], void>({
            query: () => "/lessons/categories/admin",
            transformResponse: (response: any) => response.data, // extract the array
            providesTags: ["Category", "Lesson"],
        }),
        createCategory: builder.mutation<Category, FormData>({
            query: (formData) => ({
                url: "/lessons/categories",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Category", "Lesson"],
        }),
        updateCategory: builder.mutation<Category, { id: string; formData: FormData }>({
            query: ({ id, formData }) => ({
                url: `/lessons/categories/${id}`,
                method: "PATCH",
                body: formData,
            }),
                  invalidatesTags: ["Category", "Lesson"],
        }),
        deleteCategory: builder.mutation<void, string>({
            query: (id) => ({
                url: `/lessons/categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category", "Lesson"],
        }),
        createLesson: builder.mutation<Lesson, FormData>({
            query: (formData) => ({
                url: "/lessons/lessons",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Category", "Lesson"],
        }),
        updateLesson: builder.mutation<Lesson, { id: string; formData: FormData }>({
            query: ({ id, formData }) => ({
                url: `/lessons/lessons/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: ["Category", "Lesson"],
        }),
        deleteLesson: builder.mutation<void, string>({
            query: (id) => ({
                url: `/lessons/lessons/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category", "Lesson"],
        }),
    }),
});

export const {
    useGetAllCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useCreateLessonMutation,
    useUpdateLessonMutation,
    useDeleteLessonMutation,
} = lessonApi;