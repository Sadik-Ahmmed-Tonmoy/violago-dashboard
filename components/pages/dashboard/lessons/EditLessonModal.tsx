/* eslint-disable @typescript-eslint/no-explicit-any */
// components/edit-lesson-modal.tsx
'use client';

import { Modal, Form, Input, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import type { UploadFile, UploadFileStatus, RcFile } from 'antd/es/upload/interface';

const { Dragger } = Upload;

const editLessonSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  writerName: z.string().min(1, 'Writer name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  thumbnail: z.any().optional(),
});

export type EditLessonFormData = {
  title: string;
  writerName: string;
  description: string;
  thumbnailUrl?: string;
};

interface EditLessonModalProps {
  open: boolean;
  lesson?: {
    id: string;
    title: string;
    imageUrl: string;
    writerName: string;
    description: string;
  };
  onClose: () => void;
  onSubmit: (data: EditLessonFormData) => void;
}

export function EditLessonModal({ open, lesson, onClose, onSubmit }: EditLessonModalProps) {
  const [uploadedFile, setUploadedFile] = useState<UploadFile | null>(null);
  const [existingThumbnailRemoved, setExistingThumbnailRemoved] = useState(false);
  const [uploading, setUploading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editLessonSchema),
    defaultValues: { title: '', writerName: '', description: '' },
  });

  const fileList: UploadFile[] = uploadedFile
    ? [uploadedFile]
    : !existingThumbnailRemoved && lesson?.imageUrl
    ? [
        {
          uid: '-1',
          name: 'current-thumbnail',
          status: 'done' as UploadFileStatus,
          url: lesson.imageUrl,
        },
      ]
    : [];

  useEffect(() => {
    if (lesson) {
      reset({
        title: lesson.title,
        writerName: lesson.writerName,
        description: lesson.description,
      });
    } else {
      reset();
    }
  }, [lesson, reset]);

  const handleFormSubmit = async (data: any) => {
    let thumbnailUrl = lesson?.imageUrl;
    if (uploadedFile?.originFileObj) {
      setUploading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      thumbnailUrl = URL.createObjectURL(uploadedFile.originFileObj as RcFile);
      setUploading(false);
    } else if (existingThumbnailRemoved) {
      thumbnailUrl = undefined;
    }

    onSubmit({
      title: data.title,
      writerName: data.writerName,
      description: data.description,
      thumbnailUrl,
    });

    reset();
    setUploadedFile(null);
    setExistingThumbnailRemoved(false);
    onClose();
  };

  const handleClose = () => {
    reset();
    setUploadedFile(null);
    setExistingThumbnailRemoved(false);
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
      setUploadedFile(file);
      return false;
    },
    onRemove: () => {
      if (uploadedFile) {
        setUploadedFile(null);
      } else {
        setExistingThumbnailRemoved(true);
      }
      return true;
    },
  };

  return (
    <Modal
      title="Edit Lesson"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)}>
        <Form.Item label="Upload Thumbnail">
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag image to upload</p>
            <p className="ant-upload-hint">Replace the existing thumbnail</p>
          </Dragger>
        </Form.Item>

        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="Title"
              required
              validateStatus={errors.title ? 'error' : ''}
              help={errors.title?.message}
            >
              <Input {...field} />
            </Form.Item>
          )}
        />

        <Controller
          name="writerName"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="Writer Name"
              required
              validateStatus={errors.writerName ? 'error' : ''}
              help={errors.writerName?.message}
            >
              <Input {...field} />
            </Form.Item>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="Description"
              required
              validateStatus={errors.description ? 'error' : ''}
              help={errors.description?.message}
            >
              <Input.TextArea {...field} rows={4} />
            </Form.Item>
          )}
        />

        <Form.Item className="flex justify-end gap-3 mb-0">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 me-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Update'}
          </button>
        </Form.Item>
      </Form>
    </Modal>
  );
}