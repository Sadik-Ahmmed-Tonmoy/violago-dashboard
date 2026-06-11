'use client';

import { Trash2, Edit2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { CreateLessonPlaceholder } from './create-lesson-placeholder';
import { LessonCard } from '@/components/lesson-card';

interface Lesson {
  id: string;
  title: string;
  imageUrl: string;
}

interface LessonSectionProps {
  topicId: string;
  topicName: string;
  topicIconUrl: string;
  lessons: Lesson[];
  onDeleteTopic?: () => void;
  onEditTopic?: () => void;
  onEditLesson?: (lesson: Lesson) => void;
  onDeleteLesson?: (lessonId: string) => void;
  onCreateLesson?: () => void;
  // Loading states
  isDeletingTopic?: boolean;
  isEditingTopic?: boolean;
  isDeletingLesson?: string | null;
  isAnyActionLoading?: boolean;
}

export function LessonSection({
  topicName,
  topicIconUrl,
  lessons,
  onDeleteTopic,
  onEditTopic,
  onEditLesson,
  onDeleteLesson,
  onCreateLesson,
  isDeletingTopic = false,
  isEditingTopic = false,
  isDeletingLesson = null,
  isAnyActionLoading = false,
}: LessonSectionProps) {
  const isTopicLoading = isDeletingTopic || isEditingTopic;

  return (
    <div className="space-y-4">
      {/* Topic Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden relative flex-shrink-0 bg-gray-100">
            {topicIconUrl ? (
              <Image
                src={topicIconUrl}
                alt={topicName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No icon
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{topicName}</h3>
        </div>
        <div className="flex items-center gap-2">
          {onEditTopic && (
            <button
              onClick={onEditTopic}
              disabled={isTopicLoading || isAnyActionLoading}
              className="p-2 hover:bg-gray-100 rounded transition text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Edit topic"
            >
              {isEditingTopic ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Edit2 size={20} />
              )}
            </button>
          )}
          {onDeleteTopic && (
            <button
              onClick={onDeleteTopic}
              disabled={isTopicLoading || isAnyActionLoading}
              className="p-2 hover:bg-red-50 rounded transition text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Delete topic"
            >
              {isDeletingTopic ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Trash2 size={20} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            id={lesson.id}
            title={lesson.title}
            imageUrl={lesson.imageUrl}
            onEdit={() => onEditLesson?.(lesson)}
            onDelete={() => onDeleteLesson?.(lesson.id)}
            isDeleting={isDeletingLesson === lesson.id}
            isAnyActionLoading={isAnyActionLoading}
          />
        ))}
        <CreateLessonPlaceholder
          onCreateClick={onCreateLesson}
          label={`Create New\n${topicName}`}
          disabled={isAnyActionLoading}
        />
      </div>
    </div>
  );
}