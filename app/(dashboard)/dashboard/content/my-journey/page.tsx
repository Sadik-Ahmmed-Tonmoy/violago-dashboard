/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { JourneyPartSection } from '@/components/pages/dashboard/my-journey/journey-part-section';
import { CreatePartModal } from '@/components/pages/dashboard/my-journey/create-part-modal';
import { EditPartModal } from '@/components/pages/dashboard/my-journey/edit-part-modal';
import { CreateJourneyLessonModal } from '@/components/pages/dashboard/my-journey/create-journey-lesson-modal';
import { EditJourneyLessonModal } from '@/components/pages/dashboard/my-journey/edit-journey-lesson-modal';
import {
  useGetAllPartsQuery,
  useCreatePartMutation,
  useUpdatePartMutation,
  useDeletePartMutation,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} from '@/redux/features/journeyApi';
import { message, Spin } from 'antd';
import { Plus } from 'lucide-react';
import Swal from 'sweetalert2';

export default function MyJourneyPage() {
  const { data: parts, isLoading, isFetching, refetch } = useGetAllPartsQuery();
  const [createPart, { isLoading: isCreatingPart }] = useCreatePartMutation();
  const [updatePart, { isLoading: isUpdatingPart }] = useUpdatePartMutation();
  const [deletePart, { isLoading: isDeletingPart }] = useDeletePartMutation();
  const [createLesson, { isLoading: isCreatingLesson }] = useCreateLessonMutation();
  const [updateLesson, { isLoading: isUpdatingLesson }] = useUpdateLessonMutation();
  const [deleteLesson, { isLoading: isDeletingLesson }] = useDeleteLessonMutation();

  // Modal states
  const [isCreatePartOpen, setIsCreatePartOpen] = useState(false);
  const [isEditPartOpen, setIsEditPartOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<{ id: string; partNumber: number; title?: string; imageUrl?: string } | null>(null);
  const [isCreateLessonOpen, setIsCreateLessonOpen] = useState(false);
  const [isEditLessonOpen, setIsEditLessonOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [selectedPartId, setSelectedPartId] = useState<string>('');
  const [createLessonTitle, setCreateLessonTitle] = useState('');

  // Track loading for individual deletions
  const [deletingPartId, setDeletingPartId] = useState<string | null>(null);
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);

  const isAnyMutationLoading =
    isCreatingPart ||
    isUpdatingPart ||
    isDeletingPart ||
    isCreatingLesson ||
    isUpdatingLesson ||
    isDeletingLesson;

  // Part handlers
  const handleCreatePart = async (formData: FormData) => {
    try {
      await createPart(formData).unwrap();
      message.success('Part created');
      setIsCreatePartOpen(false);
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to create part');
    }
  };

  const handleUpdatePart = async (id: string, formData: FormData) => {
    try {
      await updatePart({ id, formData }).unwrap();
      message.success('Part updated');
      setIsEditPartOpen(false);
      setSelectedPart(null);
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to update part');
    }
  };

  const handleDeletePart = async (id: string, title: string) => {
    const result = await Swal.fire({
      title: 'Delete Part?',
      html: `Are you sure you want to delete "<strong>${title || 'Part'}</strong>"?<br/>All lessons inside will also be permanently deleted.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      setDeletingPartId(id);
      try {
        await deletePart(id).unwrap();
        message.success('Part deleted');
        Swal.fire('Deleted!', 'Part has been removed.', 'success');
      } catch (err: any) {
        message.error(err?.data?.message || 'Failed to delete part');
        Swal.fire('Error!', err?.data?.message || 'Could not delete part.', 'error');
      } finally {
        setDeletingPartId(null);
      }
    }
  };

  // Lesson handlers
  const handleAddLesson = (partId: string, partTitle: string) => {
    setSelectedPartId(partId);
    setCreateLessonTitle(`Create New Lesson in ${partTitle}`);
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

  const handleDeleteLesson = async (lessonId: string, lessonTitle: string) => {
    const result = await Swal.fire({
      title: 'Delete Lesson?',
      text: `"${lessonTitle}" will be permanently removed.`,
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
      } catch (err: any) {
        message.error(err?.data?.message || 'Failed to delete lesson');
        Swal.fire('Error!', err?.data?.message || 'Could not delete lesson.', 'error');
      } finally {
        setDeletingLessonId(null);
      }
    }
  };

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
          <h2 className="text-2xl font-bold text-gray-900">My Journey</h2>
          <button
            onClick={() => setIsCreatePartOpen(true)}
            disabled={isAnyMutationLoading}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
            {isCreatingPart ? 'Creating...' : 'Add New Part'}
          </button>
        </div>

        <div className="space-y-10">
          {parts?.map((part) => (
            <JourneyPartSection
              key={part.id}
              partId={part.id}
              partNumber={part.partNumber}
              partTitle={part.title || `Part ${part.partNumber}`}
              partImageUrl={part.imageUrl || ''}
              lessons={part.lessons || []}
              onDeletePart={() => handleDeletePart(part.id, part.title || `Part ${part.partNumber}`)}
              isDeletingPart={deletingPartId === part.id}
              onEditPart={() => {
                setSelectedPart(part);
                setIsEditPartOpen(true);
              }}
              isEditingPart={isUpdatingPart && selectedPart?.id === part.id}
              onEditLesson={(lesson) => handleEditLesson(lesson)}
              onCreateLesson={() => handleAddLesson(part.id, part.title || `Part ${part.partNumber}`)}
              onDeleteLesson={(lessonId, lessonTitle) => handleDeleteLesson(lessonId, lessonTitle)}
              isDeletingLesson={deletingLessonId}
              isAnyActionLoading={isAnyMutationLoading}
            />
          ))}
        </div>
      </div>

      {/* Create Part Modal */}
      <CreatePartModal
        open={isCreatePartOpen}
        onClose={() => setIsCreatePartOpen(false)}
        onSubmit={handleCreatePart}
      />

      {/* Edit Part Modal */}
      <EditPartModal
        open={isEditPartOpen}
        part={selectedPart}
        onClose={() => {
          setIsEditPartOpen(false);
          setSelectedPart(null);
        }}
        onSubmit={(formData) => handleUpdatePart(selectedPart!.id, formData)}
      />

      {/* Create Lesson Modal */}
      <CreateJourneyLessonModal
        open={isCreateLessonOpen}
        title={createLessonTitle}
        partId={selectedPartId}
        onClose={() => setIsCreateLessonOpen(false)}
        onSubmit={handleCreateLesson}
      />

      {/* Edit Lesson Modal */}
      <EditJourneyLessonModal
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