'use client'

import { Trash2 } from 'lucide-react'
import { LessonCard } from './lesson-card'
import { CreateLessonPlaceholder } from './create-lesson-placeholder'

interface Lesson {
  id: string
  title: string
  imageUrl: string
}

interface PartSectionProps {
  partNumber: number
  lessons: Lesson[]
  onDeletePart?: () => void
  onEditLesson?: (lesson: Lesson) => void
  onDeleteLesson?: (lessonId: string) => void
  onCreateLesson?: () => void
}

export function PartSection({
  partNumber,
  lessons,
  onDeletePart,
  onEditLesson,
  onDeleteLesson,
  onCreateLesson,
}: PartSectionProps) {
  return (
    <div className="space-y-4">
      {/* Part Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Part {String(partNumber).padStart(2, '0')}</h3>
        {onDeletePart && (
          <button
            onClick={onDeletePart}
            className="p-2 hover:bg-red-50 rounded transition text-red-500"
            aria-label="Delete part"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <CreateLessonPlaceholder onCreateClick={onCreateLesson} />
      </div>
    </div>
  )
}
