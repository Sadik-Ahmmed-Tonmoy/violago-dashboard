/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Modal, Form, Input } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect, useRef } from 'react';
import { Upload } from 'lucide-react';

const editSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

export type EditLessonV2FormData = {
  title: string;
  description?: string;
  thumbnailUrl?: string;
};

interface EditLessonModalV2Props {
  open: boolean;
  lesson?: {
    id: string;
    title: string;
    imageUrl: string;
    description?: string;
  };
  onClose: () => void;
  onSubmit: (data: EditLessonV2FormData) => void;
}

export function EditLessonModalV2({
  open,
  lesson,
  onClose,
  onSubmit,
}: EditLessonModalV2Props) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrl = thumbnailUrl || lesson?.imageUrl || '';

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editSchema),
    defaultValues: { title: '', description: '' },
  });

  useEffect(() => {
    if (lesson) {
      setValue('title', lesson.title);
      setValue('description', lesson.description || '');
    } else {
      reset();
    }

    return () => {
      setThumbnailUrl('');
    };
  }, [lesson, setValue, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnailUrl(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = (data: any) => {
    onSubmit({ title: data.title, description: data.description, thumbnailUrl: previewUrl });
    reset();
    setThumbnailUrl('');
    onClose();
  };

  const handleClose = () => {
    reset();
    setThumbnailUrl('');
    onClose();
  };

  return (
    <Modal
      title={<span className="text-2xl font-bold text-gray-900">Edit Lesson</span>}
      open={open}
      onCancel={handleClose}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)} className="mt-4">
        {/* Upload Thumbnail */}
        <Form.Item label="Upload Thumbnail">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-36 border border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition overflow-hidden"
          >
            {thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumbnailUrl} alt="thumbnail" className="w-full h-full object-cover" />
            ) : (
              <>
                <Upload size={28} className="text-gray-400" />
                <span className="text-sm text-gray-400">Upload Thumbnail</span>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </Form.Item>

        {/* Title */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="Title"
              validateStatus={errors.title ? 'error' : ''}
              help={errors.title?.message}
            >
              <Input {...field} className="rounded-lg" />
            </Form.Item>
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Form.Item label="Description">
              <Input.TextArea {...field} rows={4} className="rounded-lg" />
            </Form.Item>
          )}
        />

        {/* Footer */}
        <Form.Item className="flex justify-end gap-3 mb-0 mt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 me-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            Close
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 font-medium"
          >
            Update
          </button>
        </Form.Item>
      </Form>
    </Modal>
  );
}