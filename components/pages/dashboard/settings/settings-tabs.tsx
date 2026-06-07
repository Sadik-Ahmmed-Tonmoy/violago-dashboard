'use client';

import { SettingsTab } from '@/app/(dashboard)/dashboard/settings/page';
import { ChevronRight } from 'lucide-react';

interface SettingsTabsProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

const TABS: { id: SettingsTab; label: string }[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'account', label: 'Account' },
];

export function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div className="w-full md:w-64 bg-white rounded-xl border border-gray-200 overflow-hidden flex-shrink-0">
      {TABS.map((tab, index) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`w-full flex items-center justify-between px-5 py-4 text-left transition font-medium text-sm ${
            index < TABS.length - 1 ? 'border-b border-gray-100' : ''
          } ${
            activeTab === tab.id
              ? 'bg-black text-white'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span>{tab.label}</span>
          <ChevronRight
            size={18}
            className={activeTab === tab.id ? 'text-white' : 'text-gray-400'}
          />
        </button>
      ))}
    </div>
  );
}