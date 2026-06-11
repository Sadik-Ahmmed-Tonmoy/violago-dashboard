'use client';

import { Modal, Form, Input, Upload, message } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { RcFile } from 'antd/es/upload/interface';

interface CreatePartModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

export function CreatePartModal({ open, onClose, onSubmit }: CreatePartModalProps) {
  const [form] = Form.useForm();
  const [file, setFile] = useState<RcFile | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: { partNumber: number; title?: string }) => {
    const formData = new FormData();
    formData.append('partNumber', values.partNumber.toString());
    if (values.title) formData.append('title', values.title);
    if (file) formData.append('image', file);
    setLoading(true);
    try {
      await onSubmit(formData);
      form.resetFields();
      setFile(null);
      setPreviewUrl('');
      onClose();
    } catch (err) {
      message.error('Failed to create part');
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (uploadedFile: RcFile) => {
    if (!uploadedFile.type.startsWith('image/')) {
      message.error('Only image files are allowed');
      return false;
    }
    setFile(uploadedFile);
    setPreviewUrl(URL.createObjectURL(uploadedFile));
    return false;
  };

  const handleRemove = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl('');
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Modal title="Create New Part" open={open} onCancel={onClose} footer={null} width={600} destroyOnClose centered>
      <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ partNumber: 1 }}>
        <Form.Item name="partNumber" label="Part Number" rules={[{ required: true, message: 'Part number is required' }]}>
          <Input type="number" min={1} />
        </Form.Item>
        <Form.Item name="title" label="Part Title (optional)">
          <Input placeholder="e.g., Puppy Basics" />
        </Form.Item>
        <Form.Item label="Image (optional)">
          <Upload listType="picture-card" showUploadList={false} beforeUpload={beforeUpload} maxCount={1}>
            {previewUrl ? (
              <img src={previewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              uploadButton
            )}
          </Upload>
          {previewUrl && (
            <div className="mt-2 flex justify-end">
              <button onClick={handleRemove} className="text-xs text-red-500">Remove</button>
            </div>
          )}
        </Form.Item>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} type="button" className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-black text-white rounded flex items-center gap-2">
            {loading && <LoadingOutlined className="animate-spin" />}
            {loading ? 'Creating...' : 'Create Part'}
          </button>
        </div>
      </Form>
    </Modal>
  );
}