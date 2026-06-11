
'use client';

import { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight, Ban, CheckCircle } from 'lucide-react';
import { Modal, message, Spin } from 'antd';
import {
  useGetAllUSersQuery,
  useGetSingleUserQuery,
  useBlockUnblockUserMutation,
} from '@/redux/features/usersApi';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentToken } from '@/redux/features/auth/authSlice';

interface User {
  id: string;
  email: string;
  fullName: string;
  profileImage: string;
  status: 'ACTIVE' | 'BLOCKED';
  createdAt: string;
  profile?: {
    puppyName: string;
    DOB: string | null | undefined;
    ageGroup: string;
    gender: string;
    breedType: string;
    trainingReminder: boolean;
    trainingReminderTime: string | null;
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-700';
    case 'BLOCKED':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export function UsersTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
 const token = useAppSelector(selectCurrentToken);
 console.log("token", token);
  const limit = 10;

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isFetching  : isFetchingUsers,
    error: usersError,
    refetch,
  } = useGetAllUSersQuery({ page: currentPage, limit });

  const {
    data: singleUserData,
    isLoading: isLoadingSingle,
 isFetching: isFetchingSingle,
    refetch: refetchSingle,
  } = useGetSingleUserQuery(selectedUserId as string, {
    skip: !selectedUserId,
  });

  const [blockUnblock, { isLoading: isBlocking, }] = useBlockUnblockUserMutation();

  const totalPages = usersData?.data?.meta?.totalPages || 1;
  const users = usersData?.data?.data || [];

  const handleViewUser = (userId: string) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const handleBlockUnblock = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    try {
      await blockUnblock({
        id: userId,
        formData: { status: newStatus },
      }).unwrap();
      message.success(`User ${newStatus === 'ACTIVE' ? 'unblocked' : 'blocked'} successfully`);
      refetch();
      if (selectedUserId === userId) refetchSingle();
    } catch (err) {
      message.error('Failed to update user status');
    }
  };

  if (isLoadingUsers  || isFetchingUsers) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="text-center py-20 text-red-600">
        Failed to load users. Please try again.
      </div>
    );
  }

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
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Puppy Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Puppy DOB</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Puppy Gender</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user: User) => (
              <tr key={user.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xl overflow-hidden">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt={user.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <span>{user.fullName?.charAt(0) || 'U'}</span>
                      )}
                    </div>
                    <span className="font-medium text-gray-900">{user.fullName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.profile?.puppyName || '—'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.profile?.DOB ? formatDate(user.profile?.DOB) : ""}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {user.profile?.gender === 'MALE' ? 'Male' : user.profile?.gender === 'FEMALE' ? 'Female' : '—'}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {/* <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewUser(user.id)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition text-blue-600"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleBlockUnblock(user.id, user.status)}
                      disabled={isBlocking}
                      className={`p-2 rounded-lg transition ${
                        user.status === 'ACTIVE'
                          ? 'hover:bg-red-100 text-red-600'
                          : 'hover:bg-green-100 text-green-600'
                      }`}
                    >
                      {user.status === 'ACTIVE' ? <Ban size={18} /> : <CheckCircle size={18} />}
                    </button>
                  </div> */}

                     <div className="flex items-center gap-2 ">
              <button
                onClick={() => handleViewUser(user.id)}
                className="flex-1 p-2 hover:bg-blue-100 rounded-lg transition text-blue-600 flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                <span className="text-xs">View</span>
              </button>
              <button
                onClick={() => handleBlockUnblock(user.id, user.status)}
                disabled={isBlocking}
                className={`flex-1 p-2 rounded-lg transition flex items-center justify-center gap-2 ${
                  user.status === 'ACTIVE'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-green-100 text-green-600'
                },
                 ${isBlocking ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {user.status === 'ACTIVE' ? <Ban size={16} /> : <CheckCircle size={16} />}
                <span className="text-xs">{user.status === 'ACTIVE' ? 'Block' : 'Unblock'}</span>
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
        {users.map((user: User) => (
          <div key={user.id} className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xl overflow-hidden">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.fullName?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user.fullName}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(user.status)}`}
              >
                {user.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Puppy Name</p>
                <p className="font-medium text-gray-900">{user.profile?.puppyName || '—'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">DOB</p>
                <p className="font-medium text-gray-900">{user.profile?.DOB ? formatDate(user.profile?.DOB): ""}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Gender</p>
                <p className="font-medium text-gray-900">
                  {user.profile?.gender === 'MALE' ? 'Male' : user.profile?.gender === 'FEMALE' ? 'Female' : '—'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
              <button
                onClick={() => handleViewUser(user.id)}
                className="flex-1 p-2 hover:bg-blue-100 rounded-lg transition text-blue-600 flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                <span className="text-xs">View</span>
              </button>
              <button
                onClick={() => handleBlockUnblock(user.id, user.status)}
                disabled={isBlocking}
                className={`flex-1 p-2 rounded-lg transition flex items-center justify-center gap-2 ${
                  user.status === 'ACTIVE'
                    ? 'hover:bg-red-100 text-red-600'
                    : 'hover:bg-green-100 text-green-600'
                }   ${isBlocking ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {user.status === 'ACTIVE' ? <Ban size={16} /> : <CheckCircle size={16} />}
                <span className="text-xs">{user.status === 'ACTIVE' ? 'Block' : 'Unblock'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 px-4 md:px-0">
          <p className="text-sm text-gray-600">
            Page <span className="font-semibold">{currentPage}</span> of{' '}
            <span className="font-semibold">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const pageNum = i + 1;
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
                );
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* View User Modal */}
      <Modal
        title="User Details"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedUserId(null);
        }}
        loading={isLoadingSingle || isFetchingSingle}
        footer={null}
        width={600}
      >
        {isLoadingSingle ? (
          <div className="flex justify-center py-10">
            <Spin />
          </div>
        ) : singleUserData?.data ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                {singleUserData.data.profileImage ? (
                  <img
                    src={singleUserData.data.profileImage}
                    alt={singleUserData.data.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    {singleUserData.data.fullName?.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold">{singleUserData.data.fullName}</h3>
                <p className="text-gray-500">{singleUserData.data.email}</p>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(
                    singleUserData.data.status
                  )}`}
                >
                  {singleUserData.data.status}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Puppy Information</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Puppy Name</p>
                  <p className="font-medium">{singleUserData.data.profile?.puppyName || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Date of Birth</p>
                  <p className="font-medium">{formatDate(singleUserData.data.profile?.DOB)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Age Group</p>
                  <p className="font-medium">{singleUserData.data.profile?.ageGroup || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Gender</p>
                  <p className="font-medium">
                    {singleUserData.data.profile?.gender === 'MALE'
                      ? 'Male'
                      : singleUserData.data.profile?.gender === 'FEMALE'
                      ? 'Female'
                      : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Breed</p>
                  <p className="font-medium">{singleUserData.data.profile?.breedType || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Training Reminder</p>
                  <p className="font-medium">
                    {singleUserData.data.profile?.trainingReminder ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Account Details</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">User ID</p>
                  <p className="font-mono text-xs">{singleUserData.data.id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Joined</p>
                  <p className="font-medium">{formatDate(singleUserData.data.createdAt)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Login Process</p>
                  <p className="font-medium">{singleUserData.data.logInProcess}</p>
                </div>
                <div>
                  <p className="text-gray-500">Verified</p>
                  <p className="font-medium">{singleUserData.data.isVerified ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  handleBlockUnblock(singleUserData.data.id, singleUserData.data.status);
                }}
                disabled={isBlocking}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                  singleUserData.data.status === 'ACTIVE'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {singleUserData.data.status === 'ACTIVE' ? <Ban size={16} /> : <CheckCircle size={16} />}
                {singleUserData.data.status === 'ACTIVE' ? 'Block User' : 'Unblock User'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-red-500">Failed to load user details.</div>
        )}
      </Modal>
    </div>
  );
}