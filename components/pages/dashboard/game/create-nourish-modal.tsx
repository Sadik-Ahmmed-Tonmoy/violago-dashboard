/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Modal, Form, Input } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { NourishItem } from '@/app/(dashboard)/dashboard/content/game/page';

const schema = z.object({
  heading: z.string().min(1, 'Heading is required'),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  description: z.string().min(1, 'Description is required'),
});

interface CreateNourishModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<NourishItem, 'id'>) => void;
}

export function CreateNourishModal({ open, onClose, onSubmit }: CreateNourishModalProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { heading: '', title: '', subtitle: '', description: '' },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith('image/')) {
      setThumbnailUrl(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = (data: any) => {
    onSubmit({ ...data, thumbnailUrl });
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
      title={<span className="text-2xl font-bold text-gray-900">Create New nourish</span>}
      open={open}
      onCancel={handleClose}
      footer={null}
      width={620}
      destroyOnClose
    >
      <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)} className="mt-4">
        {/* Upload Thumbnail */}
        <Form.Item label="Upload Thumbnail">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 border border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition overflow-hidden"
          >
            {thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumbnailUrl} alt="thumbnail" className="w-full h-full object-cover" />
            ) : (
              <>
                <Upload size={26} className="text-gray-400" />
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

        {/* Heading */}
        <Controller
          name="heading"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="Heading"
              validateStatus={errors.heading ? 'error' : ''}
              help={errors.heading?.message}
            >
              <Input {...field} placeholder="Tips" className="rounded-lg" />
            </Form.Item>
          )}
        />

        {/* Title + Subtitle side by side */}
        <div className="grid grid-cols-2 gap-4">
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
          <Controller
            name="subtitle"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Subtitle"
                validateStatus={errors.subtitle ? 'error' : ''}
                help={errors.subtitle?.message}
              >
                <Input {...field} placeholder="Subtitle" className="rounded-lg" />
              </Form.Item>
            )}
          />
        </div>

        {/* Description */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="Description"
              validateStatus={errors.description ? 'error' : ''}
              help={errors.description?.message}
            >
              <Input.TextArea {...field} rows={5} placeholder="Description" className="rounded-lg" />
            </Form.Item>
          )}
        />

        {/* Footer */}
        <Form.Item className="flex justify-end gap-3 mb-0 mt-2">
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