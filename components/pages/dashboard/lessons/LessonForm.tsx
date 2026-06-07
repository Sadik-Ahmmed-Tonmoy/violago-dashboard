/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Upload, X } from 'lucide-react';

const lessonSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  writerName: z.string().min(1, 'Writer name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  thumbnail: z.string().optional(),
  partId: z.string().optional(),
});

type LessonFormData = z.infer<typeof lessonSchema>;

interface LessonFormProps {
  initialData?: any;
  onSave: (data: LessonFormData) => void;
  onClose: () => void;
}

export default function LessonForm({ initialData, onSave, onClose }: LessonFormProps) {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(initialData?.thumbnail || null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: initialData || {
      title: '',
      writerName: '',
      description: '',
      thumbnail: '',
    },
  });

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Mock upload – replace with actual S3/API upload
    const fakeUrl = URL.createObjectURL(file);
    setTimeout(() => {
      setThumbnailPreview(fakeUrl);
      setValue('thumbnail', fakeUrl);
      setIsUploading(false);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit(onSave)} className="p-6 space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{initialData ? 'Edit Lesson' : 'Create New Lesson'}</h2>
        <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnail Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Thumbnail</label>
        <div className="flex gap-4 items-start">
          <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
            {thumbnailPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
            ) : (
              <Upload className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailUpload}
              className="text-sm text-gray-500 file:mr-2 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              disabled={isUploading}
            />
            {isUploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
          </div>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          {...register('title')}
          className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-200"
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
      </div>

      {/* Writer Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Writer Name</label>
        <input
          {...register('writerName')}
          className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-200"
        />
        {errors.writerName && <p className="text-red-500 text-xs mt-1">{errors.writerName.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description')}
          rows={4}
          className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-200"
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
      </div>

      {/* Part selection (optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Part (optional)</label>
        <select {...register('partId')} className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-200">
          <option value="">No part</option>
          <option value="part1">Part 01</option>
          <option value="part2">Part 02</option>
          <option value="part3">Part 03</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Close
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}