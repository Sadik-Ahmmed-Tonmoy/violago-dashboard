'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { SettingsTabs } from '@/components/pages/dashboard/settings/settings-tabs';
import { BasicSettingsPanel } from '@/components/pages/dashboard/settings/basic-settings-panel';
import { AccountSettingsPanel } from '@/components/pages/dashboard/settings/account-settings-panel';


export type SettingsTab = 'basic' | 'account';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('basic');

  return (
    <main className="flex-1 lg:ml-0">
      <Header title="Setting" />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Left Tab Nav */}
          <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Right Content Panel */}
          <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6 md:p-8">
            {activeTab === 'basic' && <BasicSettingsPanel />}
            {activeTab === 'account' && <AccountSettingsPanel />}
          </div>
        </div>
      </div>
    </main>
  );
}