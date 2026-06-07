'use client';

import { NourishItem } from '@/app/(dashboard)/dashboard/content/game/page';
import { Modal } from 'antd';
import Image from 'next/image';

interface ViewNourishModalProps {
  open: boolean;
  item?: NourishItem;
  onClose: () => void;
}

export function ViewNourishModal({ open, item, onClose }: ViewNourishModalProps) {
  if (!item) return null;

  return (
    <Modal
      title={<span className="text-2xl font-bold text-gray-900">View nourish</span>}
      open={open}
      onCancel={onClose}
      footer={
        <button
          onClick={onClose}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
        >
          Close
        </button>
      }
      width={620}
      destroyOnClose
    >
      <div className="space-y-4 mt-4">
        {item.thumbnailUrl && (
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <Image src={item.thumbnailUrl} alt={item.title} fill className="object-cover" />
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Heading</p>
            <p className="text-sm text-gray-900 font-medium">{item.heading}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Title</p>
            <p className="text-sm text-gray-900 font-medium">{item.title}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Subtitle</p>
            <p className="text-sm text-gray-900 font-medium">{item.subtitle}</p>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Description</p>
          <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
        </div>
      </div>
    </Modal>
  );
}