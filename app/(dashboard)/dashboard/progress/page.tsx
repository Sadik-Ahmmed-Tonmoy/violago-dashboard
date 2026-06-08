'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { ProgressTable } from '@/components/pages/dashboard/progress/progress-table';

export interface ProgressEntry {
  id: string;
  userName: string;
  avatarUrl: string;
  lessonName: string;
  completed: number;
  total: number;
  lastActivity: string;
  status: 'On track' | 'Just started' | 'Completed';
}

const MOCK_DATA: ProgressEntry[] = [
  { id: '1', userName: 'John Martinez', avatarUrl: 'https://demo.joomlead.com/particles/templates/g5_hydrogen/custom/images/sampledata/team1.png', lessonName: 'Adolescence', completed: 16, total: 28, lastActivity: '2 hours ago', status: 'On track' },
  { id: '2', userName: 'Alex Carter', avatarUrl: 'https://demo.joomlead.com/particles/templates/g5_hydrogen/custom/images/sampledata/team2.png', lessonName: 'Adolescence', completed: 24, total: 28, lastActivity: '2 hours ago', status: 'On track' },
  { id: '3', userName: 'Mia Johnson', avatarUrl: 'https://demo.joomlead.com/particles/templates/g5_hydrogen/custom/images/sampledata/team3.png', lessonName: 'Adolescence', completed: 24, total: 28, lastActivity: '2 hours ago', status: 'On track' },
  { id: '4', userName: 'Karen Starr', avatarUrl: 'https://demo.joomlead.com/particles/templates/g5_hydrogen/custom/images/sampledata/team1.png', lessonName: 'Adolescence', completed: 0, total: 28, lastActivity: '2 hours ago', status: 'Just started' },
  { id: '5', userName: 'John Doe', avatarUrl: 'https://demo.joomlead.com/particles/templates/g5_hydrogen/custom/images/sampledata/team2.png', lessonName: 'Adolescence', completed: 0, total: 28, lastActivity: '2 hours ago', status: 'Just started' },
  { id: '6', userName: 'Harleen Quinzel', avatarUrl: 'https://demo.joomlead.com/particles/templates/g5_hydrogen/custom/images/sampledata/team3.png', lessonName: 'Adolescence', completed: 0, total: 28, lastActivity: '2 hours ago', status: 'Just started' },
  { id: '7', userName: 'Mia Johnson', avatarUrl: 'https://demo.joomlead.com/particles/templates/g5_hydrogen/custom/images/sampledata/team1.png', lessonName: 'Adolescence', completed: 0, total: 28, lastActivity: '2 hours ago', status: 'Just started' },
  { id: '8', userName: 'Lois Lane', avatarUrl: 'https://demo.joomlead.com/particles/templates/g5_hydrogen/custom/images/sampledata/team2.png', lessonName: 'Adolescence', completed: 28, total: 28, lastActivity: '2 hours ago', status: 'Completed' },
  { id: '9', userName: 'Lois Lane', avatarUrl: 'https://demo.joomlead.com/particles/templates/g5_hydrogen/custom/images/sampledata/team3.png', lessonName: 'Adolescence', completed: 28, total: 28, lastActivity: '2 hours ago', status: 'Completed' },
  { id: '10', userName: 'Lois Lane', avatarUrl: 'https://demo.joomlead.com/particles/templates/g5_hydrogen/custom/images/sampledata/team1.png', lessonName: 'Adolescence', completed: 28, total: 28, lastActivity: '2 hours ago', status: 'Completed' },
  ...Array.from({ length: 430 }, (_, i) => ({
    id: `${i + 11}`,
    userName: 'Lois Lane',
    avatarUrl: 'https://demo.joomlead.com/particles/templates/g5_hydrogen/custom/images/sampledata/team1.png',
    lessonName: 'Adolescence',
    completed: 28,
    total: 28,
    lastActivity: '2 hours ago',
    status: 'Completed' as const,
  })),
];

const PAGE_SIZE = 10;

export default function ProgressViewerPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(MOCK_DATA.length / PAGE_SIZE);
  const paginatedData = MOCK_DATA.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <main className="flex-1 lg:ml-0">
      <Header title="Progress Viewer" />
      <div className="p-4 sm:p-6 lg:p-8">
        <ProgressTable
          entries={paginatedData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </main>
  );
}