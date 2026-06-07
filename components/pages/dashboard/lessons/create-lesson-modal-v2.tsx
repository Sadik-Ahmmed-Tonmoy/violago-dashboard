/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Modal, Form, Input } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

const lessonSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

export type LessonV2FormData = {
  title: string;
  description?: string;
  thumbnailUrl?: string;
};

interface CreateLessonModalV2Props {
  open: boolean;
  title?: string;
  onClose: () => void;
  onSubmit: (data: LessonV2FormData) => void;
}

export function CreateLessonModalV2({
  open,
  title = 'Create New Lessons',
  onClose,
  onSubmit,
}: CreateLessonModalV2Props) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(lessonSchema),
    defaultValues: { title: '', description: '' },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnailUrl(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = (data: any) => {
    onSubmit({ title: data.title, description: data.description, thumbnailUrl });
    reset();
    setThumbnailUrl('');
  };

  const handleClose = () => {
    reset();
    setThumbnailUrl('');
    onClose();
  };

  return (
    <Modal
      title={<span className="text-2xl font-bold text-gray-900">{title}</span>}
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
              <Input {...field} placeholder="Title" className="rounded-lg" />
            </Form.Item>
          )}
        />

        {/* Description — shown only when it's a topic-specific modal */}
        {title !== 'Create New Lessons' && (
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Form.Item label="Description">
                <Input.TextArea
                  {...field}
                  rows={4}
                  placeholder="Description"
                  className="rounded-lg"
                />
              </Form.Item>
            )}
          />
        )}

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
            Submit
          </button>
        </Form.Item>
      </Form>
    </Modal>
  );
}