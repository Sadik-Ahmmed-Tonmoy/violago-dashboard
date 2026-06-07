'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { PartSection } from '@/components/part-section';
import { CreateLessonModal } from '@/components/create-lesson-modal';
import { EditLessonModal } from '@/components/edit-lesson-modal';
import type { LessonFormData } from '@/components/create-lesson-modal';
import type { EditLessonFormData } from '@/components/edit-lesson-modal';

interface Lesson {
  id: string;
  title: string;
  imageUrl: string;
  writerName?: string;
  description?: string;
}

interface Part {
  id: string;
  number: number;
  lessons: Lesson[];
}

const INITIAL_LESSONS: Lesson[] = [
  { id: '1', title: 'Create Training', imageUrl: '/shepherd-1.png', writerName: 'John Doe', description: 'Learn crate training basics.' },
  { id: '2', title: 'Sleep Training', imageUrl: '/shepherd-2.png', writerName: 'Jane Smith', description: 'Establish good sleep habits.' },
  { id: '3', title: 'Arriving Home', imageUrl: '/shepherd-3.png', writerName: 'Mike Brown', description: 'First day at home.' },
  { id: '4', title: 'Toilet Training Intro', imageUrl: '/shepherd-4.png', writerName: 'Sarah Lee', description: 'Introduction to toilet training.' },
];

const INITIAL_PARTS: Part[] = [
  { id: 'p1', number: 1, lessons: INITIAL_LESSONS },
  { id: 'p2', number: 2, lessons: INITIAL_LESSONS },
  { id: 'p3', number: 3, lessons: [] },
];

export default function ContentPage() {
  const [parts, setParts] = useState<Part[]>(INITIAL_PARTS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedPartId, setSelectedPartId] = useState<string>('');

  const handleDeletePart = (partId: string) => {
    setParts((prev) => prev.filter((p) => p.id !== partId));
  };

  const handleDeleteLesson = (partId: string, lessonId: string) => {
    setParts((prev) =>
      prev.map((part) =>
        part.id === partId
          ? { ...part, lessons: part.lessons.filter((l) => l.id !== lessonId) }
          : part
      )
    );
  };

  const handleAddPart = () => {
    const newPartNumber = Math.max(...parts.map((p) => p.number), 0) + 1;
    const newPart: Part = {
      id: `p${Date.now()}`,
      number: newPartNumber,
      lessons: [],
    };
    // Add new part at the top (newest first)
    setParts((prev) => [newPart, ...prev]);
  };

  const handleAddLesson = (partId: string) => {
    setSelectedPartId(partId);
    setIsCreateModalOpen(true);
  };

  const handleCreateLesson = (formData: LessonFormData) => {
    const newLesson: Lesson = {
      id: `l${Date.now()}`,
      title: formData.title,
      imageUrl: formData.thumbnailUrl || '/shepherd-1.png',
    };
    setParts((prev) =>
      prev.map((part) =>
        part.id === selectedPartId
          ? { ...part, lessons: [...part.lessons, newLesson] }
          : part
      )
    );
    setIsCreateModalOpen(false);
    setSelectedPartId('');
  };

  const handleEditLesson = (partId: string, lesson: Lesson) => {
    setSelectedPartId(partId);
    setSelectedLesson(lesson);
    setIsEditModalOpen(true);
  };

  const handleUpdateLesson = (formData: EditLessonFormData) => {
    setParts((prev) =>
      prev.map((part) =>
        part.id === selectedPartId
          ? {
              ...part,
              lessons: part.lessons.map((l) =>
                l.id === selectedLesson?.id
                  ? {
                      ...l,
                      title: formData.title,
                      writerName: formData.writerName,
                      description: formData.description,
                      imageUrl: formData.thumbnailUrl || l.imageUrl,
                    }
                  : l
              ),
            }
          : part
      )
    );
    setIsEditModalOpen(false);
    setSelectedLesson(null);
    setSelectedPartId('');
  };

  // Display parts in the order they are stored (newest first – already handled by handleAddPart)
  // No need for .reverse() because we insert new parts at the beginning.
  const displayedParts = parts;

  return (
    <main className="flex-1 lg:ml-0">
      <Header title="Content Management" />
      <div className="p-4 sm:p-6 lg:p-8 mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">My Journey</h2>
          <button
            onClick={handleAddPart}
            className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition font-medium"
          >
            Add New Part
          </button>
        </div>

        <div className="space-y-12">
          {displayedParts.map((part) => (
            <PartSection
              key={part.id}
              partNumber={part.number}
              lessons={part.lessons}
              onDeletePart={() => handleDeletePart(part.id)}
              onEditLesson={(lesson) => handleEditLesson(part.id, lesson)}
              onCreateLesson={() => handleAddLesson(part.id)}
              onDeleteLesson={(lessonId) => handleDeleteLesson(part.id, lessonId)}
            />
          ))}
        </div>
      </div>

      <CreateLessonModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateLesson}
      />
      <EditLessonModal
        open={isEditModalOpen}
        lesson={selectedLesson || undefined}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateLesson}
      />
    </main>
  );
}