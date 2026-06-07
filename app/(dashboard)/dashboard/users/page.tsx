import { Header } from '@/components/header';
import { StatCards } from '@/components/stat-cards';
import { UsersTable } from '@/components/users-table';
import React from 'react';

const page = () => {
    return (
        <main className="flex-1 lg:ml-0">
            <Header title="User Management" />
            <StatCards />
            <UsersTable />
        </main>
    );
};

export default page;