/* eslint-disable @typescript-eslint/no-explicit-any */
// components/create-lesson-modal.tsx
'use client';

import { Modal, Form, Input, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';

const { Dragger } = Upload;

const lessonSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  writerName: z.string().min(1, 'Writer name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  thumbnail: z.any().optional(),
});

export type LessonFormData = {
  title: string;
  writerName: string;
  description: string;
  thumbnailUrl?: string;
};

interface CreateLessonModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LessonFormData) => void;
  category?: 'puberty' | 'barking' | 'being-alone' | 'general';
}

export function CreateLessonModal({ open, onClose, onSubmit, category = 'general' }: CreateLessonModalProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(lessonSchema),
    defaultValues: { title: '', writerName: '', description: '' },
  });

  const getModalTitle = () => {
    switch (category) {
      case 'puberty': return 'Create New Puberty';
      case 'barking': return 'Create New BARKING';
      case 'being-alone': return 'Create New Being Alone';
      default: return 'Create New Lesson';
    }
  };

  const handleFormSubmit = async (data: any) => {
    let thumbnailUrl = '';
    if (fileList.length > 0) {
      setUploading(true);
      // Simulate upload – replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      thumbnailUrl = URL.createObjectURL(fileList[0].originFileObj as RcFile);
      setUploading(false);
    }
    onSubmit({
      title: data.title,
      writerName: data.writerName,
      description: data.description,
      thumbnailUrl,
    });
    reset();
    setFileList([]);
  };

  const handleClose = () => {
    reset();
    setFileList([]);
    onClose();
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    fileList,
    beforeUpload: (file: RcFile) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      setFileList([file]);
      return false;
    },
    onRemove: () => setFileList([]),
  };

  return (
    <Modal
      title={getModalTitle()}
      open={open}
      onCancel={handleClose}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)}>
        <Form.Item label="Upload Thumbnail" required>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon"><InboxOutlined /></p>
            <p className="ant-upload-text">Click or drag image to upload</p>
            <p className="ant-upload-hint">Support for a single image upload</p>
          </Dragger>
        </Form.Item>

        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Form.Item label="Title" required validateStatus={errors.title ? 'error' : ''} help={errors.title?.message}>
              <Input {...field} placeholder="Lesson title" />
            </Form.Item>
          )}
        />

        <Controller
          name="writerName"
          control={control}
          render={({ field }) => (
            <Form.Item label="Writer Name" required validateStatus={errors.writerName ? 'error' : ''} help={errors.writerName?.message}>
              <Input {...field} placeholder="Writer name" />
            </Form.Item>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Form.Item label="Description" required validateStatus={errors.description ? 'error' : ''} help={errors.description?.message}>
              <Input.TextArea {...field} rows={4} placeholder="Lesson description" />
            </Form.Item>
          )}
        />

        <Form.Item className="flex justify-end gap-3 mb-0">
          <button type="button" onClick={handleClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Close
          </button>
          <button type="submit" disabled={uploading} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50">
            {uploading ? 'Uploading...' : 'Submit'}
          </button>
        </Form.Item>
      </Form>
    </Modal>
  );
}