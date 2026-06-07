'use client';

import { Trash2 } from 'lucide-react';
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
  onEditLesson?: (lesson: Lesson) => void;
  onDeleteLesson?: (lessonId: string) => void;
  onCreateLesson?: () => void;
}

export function LessonSection({
  topicName,
  topicIconUrl,
  lessons,
  onDeleteTopic,
  onEditLesson,
  onDeleteLesson,
  onCreateLesson,
}: LessonSectionProps) {
  return (
    <div className="space-y-4">
      {/* Topic Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden relative flex-shrink-0">
            <Image
              src={topicIconUrl}
              alt={topicName}
              fill
              className="object-cover"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{topicName}</h3>
        </div>
        {onDeleteTopic && (
          <button
            onClick={onDeleteTopic}
            className="p-2 hover:bg-red-50 rounded transition text-red-500"
            aria-label="Delete topic"
          >
            <Trash2 size={20} />
          </button>
        )}
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
          />
        ))}
        <CreateLessonPlaceholder
          onCreateClick={onCreateLesson}
          label={`Create New\n${topicName}`}
        />
      </div>
    </div>
  );
}