'use client';

import { Trash2, Edit2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { JourneyLessonCard } from './journey-lesson-card';
import { CreateLessonPlaceholder } from '@/components/pages/dashboard/lessons/create-lesson-placeholder';

interface JourneyLesson {
    id: string;
    title: string;
    description?: string;
    imageUrl?: string;
}

interface JourneyPartSectionProps {
    partId: string;
    partNumber: number;
    partTitle: string;
    partImageUrl: string;
    lessons: JourneyLesson[];
    onDeletePart: () => void;
    isDeletingPart?: boolean;
    onEditPart: () => void;
    isEditingPart?: boolean;
    onEditLesson: (lesson: JourneyLesson) => void;
    onCreateLesson: () => void;
    onDeleteLesson: (lessonId: string, lessonTitle: string) => void;
    isDeletingLesson?: string | null;
    isAnyActionLoading?: boolean;
}

export function JourneyPartSection({
    partNumber,
    partTitle,
    partImageUrl,
    lessons,
    onDeletePart,
    isDeletingPart = false,
    onEditPart,
    isEditingPart = false,
    onEditLesson,
    onCreateLesson,
    onDeleteLesson,
    isDeletingLesson,
    isAnyActionLoading = false,
}: JourneyPartSectionProps) {
    const isPartLoading = isDeletingPart || isEditingPart;

    return (
        <div className="space-y-4">
            {/* Part Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {partImageUrl && (
                        <div className="w-10 h-10 rounded-xl overflow-hidden relative flex-shrink-0 bg-gray-100">
                            <Image src={partImageUrl} alt={partTitle} fill className="object-cover" />
                        </div>
                    )}
                    <div>
                        <p 
                         className="opacity-50 text-stone-600 text-sm"
                        >Part {partNumber}</p>
                        <h3 className="text-lg font-semibold text-gray-900">{partTitle}</h3>
                    </div>
                    {/* <p className="text-sm text-gray-500">{lessons.length} Lessons</p> */}

                </div>
                <div className="flex items-center gap-2">
                    {onEditPart && (
                        <button
                            onClick={onEditPart}
                            disabled={isPartLoading || isAnyActionLoading}
                            className="p-2 hover:bg-gray-100 rounded transition text-gray-600 disabled:opacity-50"
                        >
                            {isEditingPart ? <Loader2 size={20} className="animate-spin" /> : <Edit2 size={20} />}
                        </button>
                    )}
                    {onDeletePart && (
                        <button
                            onClick={onDeletePart}
                            disabled={isPartLoading || isAnyActionLoading}
                            className="p-2 hover:bg-red-50 rounded transition text-red-500 disabled:opacity-50"
                        >
                            {isDeletingPart ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                        </button>
                    )}
                </div>
            </div>

            {/* Lessons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {lessons.map((lesson) => (
                    <JourneyLessonCard
                        key={lesson.id}
                        id={lesson.id}
                        title={lesson.title}
                        imageUrl={lesson.imageUrl || ''}
                        description={lesson.description}
                        onEdit={() => onEditLesson(lesson)}
                        onDelete={() => onDeleteLesson(lesson.id, lesson.title)}
                        isDeleting={isDeletingLesson === lesson.id}
                        isAnyActionLoading={isAnyActionLoading}
                    />
                ))}
                <CreateLessonPlaceholder
                    onCreateClick={onCreateLesson}
                    label={`Create New\nLesson`}
                    disabled={isAnyActionLoading}
                />
            </div>
        </div>
    );
}