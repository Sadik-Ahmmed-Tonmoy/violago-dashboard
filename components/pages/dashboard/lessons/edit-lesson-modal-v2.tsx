/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { Modal, Form, Input, message } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect, useRef } from 'react';
import { Upload } from 'lucide-react';

const editSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

interface EditLessonModalV2Props {
  open: boolean;
  lesson?: any;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

export function EditLessonModalV2({ open, lesson, onClose, onSubmit }: EditLessonModalV2Props) {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(editSchema),
    defaultValues: { title: '', description: '' },
  });

  useEffect(() => {
    let t: number | undefined;
    if (lesson) {
      setValue('title', lesson.title);
      setValue('description', lesson.description || '');
      t = window.setTimeout(() => {
        setPreview(lesson.imageUrl || lesson.thumbnail || '');
      }, 0);
    } else {
      reset();
      t = window.setTimeout(() => {
        setPreview('');
      }, 0);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [lesson, setValue, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        message.error('Only image files');
        return;
      }
      setThumbnailFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = (data: any) => {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
    onSubmit(formData);
    reset();
    setThumbnailFile(null);
    setPreview('');
    onClose();
  };

  const handleClose = () => {
    reset();
    setThumbnailFile(null);
    setPreview('');
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
        <Form.Item label="Thumbnail">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-36 border border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition overflow-hidden"
          >
            {preview ? (
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <Upload size={28} className="text-gray-400" />
                <span className="text-sm text-gray-400">Click to upload</span>
              </>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </Form.Item>

        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Form.Item label="Title" validateStatus={errors.title ? 'error' : ''} help={errors.title?.message}>
              <Input {...field} className="rounded-lg" />
            </Form.Item>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Form.Item label="Description">
              <Input.TextArea {...field} rows={4} className="rounded-lg" />
            </Form.Item>
          )}
        />

        <Form.Item className="flex justify-end gap-3 mb-0 mt-4">
          <button type="button" onClick={handleClose} className="px-6 py-2.5 border rounded-lg me-3">
            Cancel
          </button>
          <button type="submit" className="px-6 py-2.5 bg-black text-white rounded-lg">
            Update
          </button>
        </Form.Item>
      </Form>
    </Modal>
  );
}