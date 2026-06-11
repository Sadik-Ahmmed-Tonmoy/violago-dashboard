'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { ProgressTable } from '@/components/pages/dashboard/progress/progress-table';
import { Spin } from 'antd';
import { useGetProgressViewerQuery } from '@/redux/features/progressApi';

export default function ProgressViewerPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isFetching, error } = useGetProgressViewerQuery({
    page: currentPage,
    limit: pageSize,
  });

  const entries = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  if (isLoading || isFetching) {
    return (
      <main className="flex-1 lg:ml-0">
        <Header title="Progress Viewer" />
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 lg:ml-0">
        <Header title="Progress Viewer" />
        <div className="text-center py-20 text-red-500">
          Failed to load progress data. Please try again.
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 lg:ml-0">
      <Header title="Progress Viewer" />
      <div className="p-4 sm:p-6 lg:p-8">
        <ProgressTable
          entries={entries}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </main>
  );
}