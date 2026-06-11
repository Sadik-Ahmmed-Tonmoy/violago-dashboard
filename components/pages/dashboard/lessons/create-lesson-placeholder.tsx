import { Plus } from 'lucide-react';

interface CreateLessonPlaceholderProps {
  onCreateClick?: () => void;
  label?: string;
  disabled?: boolean;
}

export function CreateLessonPlaceholder({
  onCreateClick,
  label = 'Create New lesson',
  disabled = false,
}: CreateLessonPlaceholderProps) {
  return (
    <button
      onClick={onCreateClick}
      disabled={disabled}
      className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300"
      aria-label="Create new lesson"
    >
      <Plus size={32} />
      <span className="text-sm font-medium text-center whitespace-pre-line leading-snug">
        {label}
      </span>
    </button>
  );
}