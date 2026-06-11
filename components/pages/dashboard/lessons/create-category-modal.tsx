'use client';

import { Modal, Form, Input, Upload, message } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';

interface CreateCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

export function CreateCategoryModal({ open, onClose, onSubmit }: CreateCategoryModalProps) {
  const [form] = Form.useForm();
  const [file, setFile] = useState<RcFile | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: { name: string }) => {
    const formData = new FormData();
    formData.append('name', values.name);
    if (file) {
      formData.append('icon', file);
    }
    setLoading(true);
    try {
      await onSubmit(formData);
      form.resetFields();
      setFile(null);
      setPreviewUrl('');
      onClose();
    } catch (error) {
      message.error('Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (uploadedFile: RcFile) => {
    const isImage = uploadedFile.type.startsWith('image/');
    if (!isImage) {
      message.error('Only image files are allowed');
      return false;
    }
    const isLt5M = uploadedFile.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB');
      return false;
    }
    setFile(uploadedFile);
    setPreviewUrl(URL.createObjectURL(uploadedFile));
    return false; // prevent auto upload
  };

  const handleRemove = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Modal
      title="Create New Category"
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      destroyOnClose
      centered
      className="responsive-modal"
      styles={{
        body: { padding: '24px' },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ name: '' }}
      >
        <Form.Item
          name="name"
          label="Category Name"
          rules={[{ required: true, message: 'Please enter category name' }]}
        >
          <Input
            placeholder="e.g., Puberty, Barking, Being Alone"
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item label="Category Icon (optional)">
          <Upload
            listType="picture-card"
            showUploadList={false}
            beforeUpload={beforeUpload}
            maxCount={1}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
          {previewUrl && (
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs text-gray-500">Image preview</span>
              <button
                onClick={handleRemove}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          )}
          <div className="text-xs text-gray-400 mt-1">
            Supported formats: JPG, PNG, GIF (Max 5MB)
          </div>
        </Form.Item>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <LoadingOutlined className="animate-spin" />}
            {loading ? 'Creating...' : 'Create Category'}
          </button>
        </div>
      </Form>

      <style jsx global>{`
        @media (max-width: 640px) {
          .responsive-modal {
            max-width: 95vw !important;
            margin: 16px;
          }
        }
      `}</style>
    </Modal>
  );
}