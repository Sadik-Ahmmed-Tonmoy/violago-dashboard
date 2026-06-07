'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { CreateLessonModalV2, LessonV2FormData } from '@/components/pages/dashboard/lessons/create-lesson-modal-v2';
import { EditLessonModalV2, EditLessonV2FormData } from '@/components/pages/dashboard/lessons/edit-lesson-modal-v2';
import { LessonSection } from '@/components/pages/dashboard/lessons/lesson-section';
// import { LessonSection } from '@/components/lesson-section';
// import { CreateLessonModalV2 } from '@/components/create-lesson-modal-v2';
// import { EditLessonModalV2 } from '@/components/edit-lesson-modal-v2';
// import type { LessonV2FormData } from '@/components/create-lesson-modal-v2';
// import type { EditLessonV2FormData } from '@/components/edit-lesson-modal-v2';

interface Lesson {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
}

interface LessonTopic {
  id: string;
  name: string;
  iconUrl: string;
  lessons: Lesson[];
}

const INITIAL_LESSONS: Lesson[] = [
  { id: '1', title: 'Aggression in Puberty', imageUrl: '/shepherd-1.png', description: 'Handling aggression.' },
  { id: '2', title: "Don't Panic!", imageUrl: '/shepherd-2.png', description: 'Stay calm techniques.' },
  { id: '3', title: 'Equipment for Your T...', imageUrl: '/shepherd-3.png', description: 'Essential equipment.' },
  { id: '4', title: 'Family Interactions w...', imageUrl: '/shepherd-4.png', description: 'Family bonding.' },
];

const INITIAL_TOPICS: LessonTopic[] = [
  { id: 't1', name: 'Puberty', iconUrl: '/shepherd-1.png', lessons: INITIAL_LESSONS },
  { id: 't2', name: 'Barking', iconUrl: '/shepherd-2.png', lessons: INITIAL_LESSONS },
  { id: 't3', name: 'Being Alone', iconUrl: '/shepherd-3.png', lessons: [] },
];

export default function LessonsPage() {
  const [topics, setTopics] = useState<LessonTopic[]>(INITIAL_TOPICS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [createModalTitle, setCreateModalTitle] = useState('');

  const handleDeleteTopic = (topicId: string) => {
    setTopics((prev) => prev.filter((t) => t.id !== topicId));
  };

  const handleDeleteLesson = (topicId: string, lessonId: string) => {
    setTopics((prev) =>
      prev.map((topic) =>
        topic.id === topicId
          ? { ...topic, lessons: topic.lessons.filter((l) => l.id !== lessonId) }
          : topic
      )
    );
  };

  const handleAddLesson = (topicId: string, topicName: string) => {
    setSelectedTopicId(topicId);
    setCreateModalTitle(`Create New ${topicName}`);
    setIsCreateModalOpen(true);
  };

  const handleCreateLesson = (formData: LessonV2FormData) => {
    const newLesson: Lesson = {
      id: `l${Date.now()}`,
      title: formData.title,
      imageUrl: formData.thumbnailUrl || '/shepherd-1.png',
      description: formData.description,
    };
    setTopics((prev) =>
      prev.map((topic) =>
        topic.id === selectedTopicId
          ? { ...topic, lessons: [...topic.lessons, newLesson] }
          : topic
      )
    );
    setIsCreateModalOpen(false);
    setSelectedTopicId('');
  };

  const handleEditLesson = (topicId: string, lesson: Lesson) => {
    setSelectedTopicId(topicId);
    setSelectedLesson(lesson);
    setIsEditModalOpen(true);
  };

  const handleUpdateLesson = (formData: EditLessonV2FormData) => {
    setTopics((prev) =>
      prev.map((topic) =>
        topic.id === selectedTopicId
          ? {
              ...topic,
              lessons: topic.lessons.map((l) =>
                l.id === selectedLesson?.id
                  ? {
                      ...l,
                      title: formData.title,
                      description: formData.description,
                      imageUrl: formData.thumbnailUrl || l.imageUrl,
                    }
                  : l
              ),
            }
          : topic
      )
    );
    setIsEditModalOpen(false);
    setSelectedLesson(null);
    setSelectedTopicId('');
  };

  const handleCreateNewLesson = () => {
    setCreateModalTitle('Create New Lessons');
    setSelectedTopicId('');
    setIsCreateModalOpen(true);
  };

  return (
    <main className="flex-1 lg:ml-0">
      <Header title="Content Management" />
      <div className="p-4 sm:p-6 lg:p-8 mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Lessons</h2>
          <button
            onClick={handleCreateNewLesson}
            className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition font-medium"
          >
            Create New lesson
          </button>
        </div>

        <div className="space-y-10">
          {topics.map((topic) => (
            <LessonSection
              key={topic.id}
              topicId={topic.id}
              topicName={topic.name}
              topicIconUrl={topic.iconUrl}
              lessons={topic.lessons}
              onDeleteTopic={() => handleDeleteTopic(topic.id)}
              onEditLesson={(lesson) => handleEditLesson(topic.id, lesson)}
              onCreateLesson={() => handleAddLesson(topic.id, topic.name)}
              onDeleteLesson={(lessonId) => handleDeleteLesson(topic.id, lessonId)}
            />
          ))}
        </div>
      </div>

      <CreateLessonModalV2
        open={isCreateModalOpen}
        title={createModalTitle}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateLesson}
      />
      <EditLessonModalV2
        open={isEditModalOpen}
        lesson={selectedLesson || undefined}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateLesson}
      />
    </main>
  );
}