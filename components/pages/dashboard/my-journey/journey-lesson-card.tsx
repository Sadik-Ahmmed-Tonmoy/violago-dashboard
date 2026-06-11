import { Edit2, Trash2, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface JourneyLessonCardProps {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  isAnyActionLoading?: boolean;
}

export function JourneyLessonCard({
  id,
  title,
  imageUrl,
  description,
  onEdit,
  onDelete,
  isDeleting = false,
  isAnyActionLoading = false,
}: JourneyLessonCardProps) {
  const isDisabled = isDeleting || isAnyActionLoading;

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition">
      {/* Image */}
      <div className="relative w-full h-40 bg-gray-100">
        <Image src={imageUrl} alt={title} fill className="object-cover" />
        {/* Action Icons */}
        <div className="absolute top-2 right-2 flex gap-1.5 lg:opacity-0 lg:group-hover:opacity-100 transition">
          <button
            onClick={onEdit}
            disabled={isDisabled}
            className="p-1.5 bg-white rounded hover:bg-gray-100 transition disabled:opacity-50"
            aria-label="Edit lesson"
          >
            <Edit2 size={16} className="text-gray-700" />
          </button>
          <button
            onClick={onDelete}
            disabled={isDisabled}
            className="p-1.5 bg-white rounded hover:bg-gray-100 transition disabled:opacity-50"
            aria-label="Delete lesson"
          >
            {isDeleting ? <Loader2 size={16} className="text-gray-700 animate-spin" /> : <Trash2 size={16} className="text-gray-700" />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 text-center text-sm line-clamp-2">{title}</h3>
        {description && (
          <p className="text-xs text-gray-500 text-center mt-1 line-clamp-2">{description}</p>
        )}
      </div>
    </div>
  );
}