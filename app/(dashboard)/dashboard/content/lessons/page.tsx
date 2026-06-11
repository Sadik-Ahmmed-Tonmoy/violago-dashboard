/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { LessonSection } from '@/components/pages/dashboard/lessons/lesson-section';
import { CreateLessonModalV2 } from '@/components/pages/dashboard/lessons/create-lesson-modal-v2';
import { EditLessonModalV2 } from '@/components/pages/dashboard/lessons/edit-lesson-modal-v2';
import { CreateCategoryModal } from '@/components/pages/dashboard/lessons/create-category-modal';
import { EditCategoryModal } from '@/components/pages/dashboard/lessons/edit-category-modal';
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} from '@/redux/features/lessonApi';
import { message, Spin } from 'antd';
import { Plus } from 'lucide-react';
import Swal from 'sweetalert2';

export default function LessonsPage() {
  const { data: categories, isLoading, isFetching, refetch } = useGetAllCategoriesQuery();
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdatingCategory }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeletingCategory }] = useDeleteCategoryMutation();
  const [createLesson, { isLoading: isCreatingLesson }] = useCreateLessonMutation();
  const [updateLesson, { isLoading: isUpdatingLesson }] = useUpdateLessonMutation();
  const [deleteLesson, { isLoading: isDeletingLesson }] = useDeleteLessonMutation();

  // Modal states
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{ id: string; name: string; iconUrl?: string } | null>(null);
  const [isCreateLessonOpen, setIsCreateLessonOpen] = useState(false);
  const [isEditLessonOpen, setIsEditLessonOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [createLessonTitle, setCreateLessonTitle] = useState('');

  // Track loading for individual category delete
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);

  const isAnyMutationLoading =
    isCreatingCategory ||
    isUpdatingCategory ||
    isDeletingCategory ||
    isCreatingLesson ||
    isUpdatingLesson ||
    isDeletingLesson;

  // Category handlers
  const handleCreateCategory = async (formData: FormData) => {
    try {
      await createCategory(formData).unwrap();
      message.success('Category created');
      setIsCreateCategoryOpen(false);
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to create category');
    }
  };

  const handleUpdateCategory = async (id: string, formData: FormData) => {
    try {
      await updateCategory({ id, formData }).unwrap();
      message.success('Category updated');
      setIsEditCategoryOpen(false);
      setSelectedCategory(null);
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to update category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const result = await Swal.fire({
      title: 'Delete Category?',
      html: `Are you sure you want to delete "<strong>${selectedCategory?.name || 'this category'}</strong>"?<br/>All lessons inside will also be permanently deleted.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setDeletingCategoryId(id);
      try {
        await deleteCategory(id).unwrap();
        message.success('Category deleted');
        Swal.fire('Deleted!', 'Category has been removed.', 'success');
        refetch();
      } catch (err: any) {
        message.error(err?.data?.message || 'Failed to delete category');
        Swal.fire('Error!', err?.data?.message || 'Could not delete category.', 'error');
      } finally {
        setDeletingCategoryId(null);
      }
    }
  };

  // Lesson handlers
  const handleAddLesson = (categoryId: string, categoryName: string) => {
    setSelectedCategoryId(categoryId);
    setCreateLessonTitle(`Create New Lesson in ${categoryName}`);
    setIsCreateLessonOpen(true);
  };

  const handleCreateLesson = async (formData: FormData) => {
    try {
      await createLesson(formData).unwrap();
      message.success('Lesson created');
      setIsCreateLessonOpen(false);
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to create lesson');
    }
  };

  const handleEditLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setIsEditLessonOpen(true);
  };

  const handleUpdateLesson = async (formData: FormData) => {
    if (!selectedLesson) return;
    try {
      await updateLesson({ id: selectedLesson.id, formData }).unwrap();
      message.success('Lesson updated');
      setIsEditLessonOpen(false);
      setSelectedLesson(null);
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to update lesson');
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    const result = await Swal.fire({
      title: 'Delete Lesson?',
      text: "This lesson will be permanently removed.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      setDeletingLessonId(lessonId);
      try {
        await deleteLesson(lessonId).unwrap();
        message.success('Lesson deleted');
        Swal.fire('Deleted!', 'Lesson has been removed.', 'success');
        refetch();
      } catch (err: any) {
        message.error(err?.data?.message || 'Failed to delete lesson');
        Swal.fire('Error!', err?.data?.message || 'Could not delete lesson.', 'error');
      } finally {
        setDeletingLessonId(null);
      }
    }
  };

  // Show global loading while fetching or refetching
  if (isLoading || isFetching) {
    return (
      <main className="flex-1 lg:ml-0">
        <Header title="Content Management" />
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 lg:ml-0">
      <Header title="Content Management" />
      <div className="p-4 sm:p-6 lg:p-8 mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Lessons</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setIsCreateCategoryOpen(true)}
              disabled={isAnyMutationLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={18} />
              {isCreatingCategory ? 'Creating...' : 'Add New Category'}
            </button>
          </div>
        </div>

        <div className="space-y-10">
          {categories?.map((category) => (
            <LessonSection
              key={category.id}
              topicId={category.id}
              topicName={category.name}
              topicIconUrl={category.iconUrl || ''}
              lessons={category.lessons?.map(l => ({ 
                id: l.id, 
                title: l.title,
                description: l.description, 
                imageUrl: l.thumbnail || '' 
              })) || []}
              onDeleteTopic={() => handleDeleteCategory(category.id)}
              isDeletingTopic={deletingCategoryId === category.id}
              onEditTopic={() => {
                setSelectedCategory({ id: category.id, name: category.name, iconUrl: category.iconUrl });
                setIsEditCategoryOpen(true);
              }}
              isEditingTopic={isUpdatingCategory && selectedCategory?.id === category.id}
              onEditLesson={(lesson) => handleEditLesson(lesson)}
              onCreateLesson={() => handleAddLesson(category.id, category.name)}
              onDeleteLesson={(lessonId) => handleDeleteLesson(lessonId)}
              isDeletingLesson={deletingLessonId}
              isAnyActionLoading={isAnyMutationLoading}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      <CreateCategoryModal
        open={isCreateCategoryOpen}
        onClose={() => setIsCreateCategoryOpen(false)}
        onSubmit={handleCreateCategory}
      />

      <EditCategoryModal
        open={isEditCategoryOpen}
        category={selectedCategory}
        onClose={() => {
          setIsEditCategoryOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={(formData) => handleUpdateCategory(selectedCategory!.id, formData)}
      />

      <CreateLessonModalV2
        open={isCreateLessonOpen}
        title={createLessonTitle}
        categoryId={selectedCategoryId}
        onClose={() => setIsCreateLessonOpen(false)}
        onSubmit={handleCreateLesson}
      />

      <EditLessonModalV2
        open={isEditLessonOpen}
        lesson={selectedLesson}
        onClose={() => {
          setIsEditLessonOpen(false);
          setSelectedLesson(null);
        }}
        onSubmit={handleUpdateLesson}
      />
    </main>
  );
}