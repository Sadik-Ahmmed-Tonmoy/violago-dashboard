'use client'

import { useState } from 'react'
import { Eye, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  puppyName: string
  puppyDOB: string
  puppyGender: string
  status: 'Active' | 'Inactive' | 'Deleted'
  avatar: string
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Martinez',
    email: 'crusader@yahoo.com',
    puppyName: 'Dog',
    puppyDOB: '26 May, 2022',
    puppyGender: 'Male',
    status: 'Active',
    avatar: '👨',
  },
  {
    id: '2',
    name: 'Alex Carter',
    email: 'mccurley@yahoo.ca',
    puppyName: 'Dog',
    puppyDOB: '26 May, 2022',
    puppyGender: 'Male',
    status: 'Active',
    avatar: '👨',
  },
  {
    id: '3',
    name: 'Mia Johnson',
    email: 'elford@mac.com',
    puppyName: 'Dog',
    puppyDOB: '26 May, 2022',
    puppyGender: 'Male',
    status: 'Active',
    avatar: '👩',
  },
  {
    id: '4',
    name: 'Karen Starr',
    email: 'pkplex@optoniline.net',
    puppyName: 'Dog',
    puppyDOB: '26 May, 2022',
    puppyGender: 'Male',
    status: 'Active',
    avatar: '👩',
  },
  {
    id: '5',
    name: 'John Doe',
    email: 'plover@aol.com',
    puppyName: 'Dog',
    puppyDOB: '26 May, 2022',
    puppyGender: 'Female',
    status: 'Deleted',
    avatar: '👨',
  },
  {
    id: '6',
    name: 'Harleen Quinzel',
    email: 'fwitness@yahoo.ca',
    puppyName: 'Dog',
    puppyDOB: '26 May, 2022',
    puppyGender: 'Female',
    status: 'Inactive',
    avatar: '👩',
  },
  {
    id: '7',
    name: 'Mia Johnson',
    email: 'fwitness@yahoo.ca',
    puppyName: 'Dog',
    puppyDOB: '26 May, 2022',
    puppyGender: 'Female',
    status: 'Inactive',
    avatar: '👩',
  },
  {
    id: '8',
    name: 'Lois Lane',
    email: 'jginspace@mac.com',
    puppyName: 'Dog',
    puppyDOB: '26 May, 2022',
    puppyGender: 'Female',
    status: 'Inactive',
    avatar: '👩',
  },
  {
    id: '9',
    name: 'Lois Lane',
    email: 'jginspace@mac.com',
    puppyName: 'Dog',
    puppyDOB: '26 May, 2022',
    puppyGender: 'Male',
    status: 'Inactive',
    avatar: '👩',
  },
  {
    id: '10',
    name: 'Lois Lane',
    email: 'smallpaul@me.com',
    puppyName: 'Dog',
    puppyDOB: '26 May, 2022',
    puppyGender: 'Male',
    status: 'Inactive',
    avatar: '👩',
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-blue-100 text-blue-700'
    case 'Inactive':
      return 'bg-amber-100 text-amber-700'
    case 'Deleted':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export function UsersTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(mockUsers.length / itemsPerPage)

  const startIdx = (currentPage - 1) * itemsPerPage
  const currentUsers = mockUsers.slice(startIdx, startIdx + itemsPerPage)

  return (
    <div className="px-4 md:px-8 py-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Users Management</h2>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email Address</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Puppy name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Puppy DOB</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Puppy Gender</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xl">
                      {user.avatar}
                    </div>
                    <span className="font-medium text-gray-900">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.puppyName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.puppyDOB}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.puppyGender}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-blue-100 rounded-lg transition text-blue-600">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 hover:bg-green-100 rounded-lg transition text-green-600">
                      <Edit2 size={18} />
                    </button>
                    <button className="p-2 hover:bg-red-100 rounded-lg transition text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {currentUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xl">
                  {user.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(user.status)}`}>
                {user.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Puppy</p>
                <p className="font-medium text-gray-900">{user.puppyName}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">DOB</p>
                <p className="font-medium text-gray-900">{user.puppyDOB}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Gender</p>
                <p className="font-medium text-gray-900">{user.puppyGender}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
              <button className="flex-1 p-2 hover:bg-blue-100 rounded-lg transition text-blue-600 flex items-center justify-center gap-2">
                <Eye size={16} />
                <span className="text-xs">View</span>
              </button>
              <button className="flex-1 p-2 hover:bg-green-100 rounded-lg transition text-green-600 flex items-center justify-center gap-2">
                <Edit2 size={16} />
                <span className="text-xs">Edit</span>
              </button>
              <button className="flex-1 p-2 hover:bg-red-100 rounded-lg transition text-red-600 flex items-center justify-center gap-2">
                <Trash2 size={16} />
                <span className="text-xs">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-8 px-4 md:px-0">
        <p className="text-sm text-gray-600">
          Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const pageNum = i + 1
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-lg font-semibold transition ${
                    currentPage === pageNum
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
            {totalPages > 5 && <span className="text-gray-600">...</span>}
            {totalPages > 5 && (
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="w-10 h-10 rounded-lg font-semibold bg-gray-100 text-gray-900 hover:bg-gray-200 transition"
              >
                {totalPages}
              </button>
            )}
          </div>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
