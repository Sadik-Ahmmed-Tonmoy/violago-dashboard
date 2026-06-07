'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { NourishTable } from '@/components/pages/dashboard/game/nourish-table';
import { CreateNourishModal } from '@/components/pages/dashboard/game/create-nourish-modal';
import { EditNourishModal } from '@/components/pages/dashboard/game/edit-nourish-modal';
import { ViewNourishModal } from '@/components/pages/dashboard/game/view-nourish-modal';
// import { NourishTable } from '@/components/nourish-table';
// import { CreateNourishModal } from '@/components/create-nourish-modal';
// import { EditNourishModal } from '@/components/edit-nourish-modal';
// import { ViewNourishModal } from '@/components/view-nourish-modal';

export interface NourishItem {
  id: string;
  heading: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnailUrl?: string;
}

const generateItems = (count: number): NourishItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `n${i + 1}`,
    heading: 'Tips',
    title: 'Most Common',
    subtitle: 'How to weight your dog?',
    description: "Regular weight checks help you monitor your dog's health...",
    thumbnailUrl: '/shepherd-1.png',
  }));

const ALL_ITEMS = generateItems(440);
const PAGE_SIZE = 10;

export default function PlayingGamePage() {
  const [items, setItems] = useState<NourishItem[]>(ALL_ITEMS);
  const [currentPage, setCurrentPage] = useState(1);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NourishItem | null>(null);

  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const paginatedItems = items.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleCreate = (data: Omit<NourishItem, 'id'>) => {
    const newItem: NourishItem = { id: `n${Date.now()}`, ...data };
    setItems((prev) => [newItem, ...prev]);
    setIsCreateOpen(false);
  };

  const handleUpdate = (data: Omit<NourishItem, 'id'>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === selectedItem?.id ? { ...item, ...data } : item
      )
    );
    setIsEditOpen(false);
    setSelectedItem(null);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEdit = (item: NourishItem) => {
    setSelectedItem(item);
    setIsEditOpen(true);
  };

  const handleView = (item: NourishItem) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  return (
    <main className="flex-1 lg:ml-0">
      <Header title="Content Management" />
      <div className="p-4 sm:p-6 lg:p-8 mx-auto">
        <NourishTable
          items={paginatedItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onCreateNew={() => setIsCreateOpen(true)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      </div>

      <CreateNourishModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />
      <EditNourishModal
        open={isEditOpen}
        item={selectedItem || undefined}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedItem(null);
        }}
        onSubmit={handleUpdate}
      />
      <ViewNourishModal
        open={isViewOpen}
        item={selectedItem || undefined}
        onClose={() => {
          setIsViewOpen(false);
          setSelectedItem(null);
        }}
      />
    </main>
  );
}