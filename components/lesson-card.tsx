import { Edit2, Trash2 } from 'lucide-react'
import Image from 'next/image'

interface LessonCardProps {
  id: string
  title: string
  imageUrl: string
  onEdit?: () => void
  onDelete?: () => void
}

export function LessonCard({ id, title, imageUrl, onEdit, onDelete }: LessonCardProps) {
  return (
    <div className="group relative bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition">
      {/* Image */}
      <div className="relative w-full h-40 bg-gray-100">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
        {/* Action Icons */}
        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={onEdit}
            className="p-1.5 bg-white rounded hover:bg-gray-100 transition"
            aria-label="Edit lesson"
          >
            <Edit2 size={16} className="text-gray-700" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 bg-white rounded hover:bg-gray-100 transition"
            aria-label="Delete lesson"
          >
            <Trash2 size={16} className="text-gray-700" />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 text-center text-sm">{title}</h3>
      </div>
    </div>
  )
}
