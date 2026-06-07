/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Modal, Form, Input, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';

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
    writerName?: string;
    description?: string;
  };
  onClose: () => void;
  onSubmit: (data: EditLessonFormData) => void;
}

export function EditLessonModal({ open, lesson, onClose, onSubmit }: EditLessonModalProps) {
  const [fileList, setFileList] = useState<UploadFile[]>(() =>
    lesson?.imageUrl
      ? [
          {
            uid: '-1',
            name: 'current-thumbnail',
            status: 'done',
            url: lesson.imageUrl,
          },
        ]
      : []
  );
  const [uploading, setUploading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editLessonSchema),
    defaultValues: {
      title: '',
      writerName: '',
      description: '',
    },
  });

  useEffect(() => {
    if (lesson) {
      setValue('title', lesson.title);
      setValue('writerName', lesson.writerName || '');
      setValue('description', lesson.description || '');
    } else {
      reset();
    }
  }, [lesson, setValue, reset]);

  const handleFormSubmit = async (data: any) => {
    let thumbnailUrl = lesson?.imageUrl;
    if (fileList.length > 0 && fileList[0].originFileObj) {
      setUploading(true);
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
    onClose();
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