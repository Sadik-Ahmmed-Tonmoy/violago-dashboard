'use client';

import { Modal, Form, Input, Upload, message } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import type { RcFile } from 'antd/es/upload/interface';

interface EditCategoryModalProps {
  open: boolean;
  category: { id: string; name: string; iconUrl?: string } | null;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

export function EditCategoryModal({ open, category, onClose, onSubmit }: EditCategoryModalProps) {
  const [form] = Form.useForm();
  const [file, setFile] = useState<RcFile | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Reset when category changes
  useEffect(() => {
    if (category) {
      form.setFieldsValue({ name: category.name });
      if (category.iconUrl) {
        setPreviewUrl(category.iconUrl);
        setFile(null);
      } else {
        setPreviewUrl('');
        setFile(null);
      }
    } else {
      form.resetFields();
      setPreviewUrl('');
      setFile(null);
    }
  }, [category, form]);

  const handleFinish = async (values: { name: string }) => {
    if (!category) return;
    const formData = new FormData();
    formData.append('name', values.name);
    if (file) {
      formData.append('icon', file);
    }
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      message.error('Failed to update category');
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
    // Revoke old preview URL if it was a blob
    if (previewUrl && previewUrl !== category?.iconUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(uploadedFile);
    setPreviewUrl(URL.createObjectURL(uploadedFile));
    return false;
  };

  const handleRemove = () => {
    if (file) {
      // Cancel pending new file
      URL.revokeObjectURL(previewUrl);
      setFile(null);
      setPreviewUrl(category?.iconUrl || '');
    }
    // If no pending file, do nothing (existing icon stays)
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Replace</div>
    </div>
  );

  const showRemoveButton = !!file; // only show when a new file is selected

  return (
    <Modal
      title="Edit Category"
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      destroyOnClose
      centered
      className="responsive-modal"
      styles={{ body: { padding: '24px' } }}
    >
      {category ? (
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: 'Please enter category name' }]}
          >
            <Input size="large" className="rounded-lg" />
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
                  alt="category icon"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
            {previewUrl && (
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {file ? 'New image ready' : 'Current image'}
                </span>
                {showRemoveButton && (
                  <button
                    onClick={handleRemove}
                    className="text-xs text-red-500 hover:text-red-700"
                    type="button"
                  >
                    Cancel change
                  </button>
                )}
              </div>
            )}
            <div className="text-xs text-gray-400 mt-1">
              Supported formats: JPG, PNG, GIF (Max 5MB). Upload a new image to replace the current one.
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
              {loading ? 'Updating...' : 'Update Category'}
            </button>
          </div>
        </Form>
      ) : (
        <div className="py-12 text-center text-gray-500">Loading category...</div>
      )}

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