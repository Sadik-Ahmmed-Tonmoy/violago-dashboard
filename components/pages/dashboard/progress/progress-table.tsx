'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProgressEntry } from '@/app/(dashboard)/dashboard/progress/page';

interface ProgressTableProps {
  entries: ProgressEntry[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const STATUS_STYLES: Record<ProgressEntry['status'], string> = {
  'On track': 'bg-cyan-50 text-cyan-600',
  'Just started': 'bg-green-50 text-green-600',
  'Completed': 'bg-teal-50 text-teal-700',
};

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="flex items-center gap-2 min-w-[140px]">
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-900 rounded-full transition-all"
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 w-8 text-right">{percent}%</span>
    </div>
  );
}

export function ProgressTable({
  entries,
  currentPage,
  totalPages,
  onPageChange,
}: ProgressTableProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Title */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Progress Viewer</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600 w-52">
                User Name
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600 w-36">
                Lesson Name
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600 w-32">
                Total Lessons
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600 w-36">
                Last Activity
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600 w-44">
                Progress
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600 w-32">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => {
              const percent =
                entry.total > 0
                  ? Math.round((entry.completed / entry.total) * 100)
                  : 1;

              return (
                <tr
                  key={entry.id}
                  className={`hover:bg-gray-50 transition ${
                    index < entries.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  {/* User Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                        <Image
                          src={entry.avatarUrl}
                          alt={entry.userName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm text-gray-800 font-medium">
                        {entry.userName}
                      </span>
                    </div>
                  </td>

                  {/* Lesson Name */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {entry.lessonName}
                  </td>

                  {/* Total Lessons */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {String(entry.completed).padStart(2, '0')}/{entry.total}
                  </td>

                  {/* Last Activity */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {entry.lastActivity}
                  </td>

                  {/* Progress Bar */}
                  <td className="px-6 py-4">
                    <ProgressBar percent={percent} />
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        STATUS_STYLES[entry.status]
                      }`}
                    >
                      {entry.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-1.5 px-6 py-4 border-t border-gray-100">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={18} className="text-gray-600" />
        </button>

        {getPageNumbers().map((page, idx) =>
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-gray-500 text-sm">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`w-8 h-8 rounded text-sm font-medium transition ${
                currentPage === page
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronRight size={18} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}