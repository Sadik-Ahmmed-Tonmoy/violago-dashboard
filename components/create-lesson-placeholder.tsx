import { Plus } from 'lucide-react'

interface CreateLessonPlaceholderProps {
  onCreateClick?: () => void
}

export function CreateLessonPlaceholder({ onCreateClick }: CreateLessonPlaceholderProps) {
  return (
    <button
      onClick={onCreateClick}
      className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-gray-700"
      aria-label="Create new lesson"
    >
      <Plus size={32} />
      <span className="text-sm font-medium">Create New lesson</span>
    </button>
  )
}
