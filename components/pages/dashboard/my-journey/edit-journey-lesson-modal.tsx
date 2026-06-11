'use client';

import { Modal, Form, Input, Upload, message } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import type { RcFile } from 'antd/es/upload/interface';

interface EditJourneyLessonModalProps {
  open: boolean;
  lesson: any; // { id, title, description, imageUrl }
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

export function EditJourneyLessonModal({ open, lesson, onClose, onSubmit }: EditJourneyLessonModalProps) {
  const [form] = Form.useForm();
  const [file, setFile] = useState<RcFile | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lesson) {
      form.setFieldsValue({ title: lesson.title, description: lesson.description || '' });
      setPreviewUrl(lesson.imageUrl || '');
      setFile(null);
    }
  }, [lesson, form]);

  const handleFinish = async (values: { title: string; description?: string }) => {
    const formData = new FormData();
    formData.append('title', values.title);
    if (values.description) formData.append('description', values.description);
    if (file) formData.append('image', file);
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      message.error('Failed to update lesson');
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

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Replace</div>
    </div>
  );

  return (
    <Modal title="Edit Lesson" open={open} onCancel={onClose} footer={null} width={600} destroyOnClose centered>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="title" label="Lesson Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description (optional)">
          <Input.TextArea rows={3} />
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
              <button onClick={() => { if (previewUrl !== lesson?.imageUrl) URL.revokeObjectURL(previewUrl); setFile(null); setPreviewUrl(lesson?.imageUrl || ''); }} className="text-xs text-red-500">Remove</button>
            </div>
          )}
        </Form.Item>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} type="button" className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-black text-white rounded flex items-center gap-2">
            {loading && <LoadingOutlined className="animate-spin" />}
            {loading ? 'Updating...' : 'Update Lesson'}
          </button>
        </div>
      </Form>
    </Modal>
  );
}