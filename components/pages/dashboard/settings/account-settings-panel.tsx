'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Info } from 'lucide-react';
import { useState } from 'react';

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export function AccountSettingsPanel() {
  const [savedSuccess, setSavedSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = (data: FormData) => {
    console.log('Password update:', data);
    reset();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-base font-semibold text-gray-900">Account Settings</h3>
        <Info size={16} className="text-gray-400" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
        {[
          { name: 'currentPassword' as const, label: 'Current Password', placeholder: 'Enter current password' },
          { name: 'newPassword' as const, label: 'New Password', placeholder: 'Enter new password' },
          { name: 'confirmPassword' as const, label: 'Confirm New Password', placeholder: 'Confirm new password' },
        ].map(({ name, label, placeholder }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    type="password"
                    placeholder={placeholder}
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition ${
                      errors[name] ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                  {errors[name] && (
                    <p className="mt-1 text-xs text-red-500">{errors[name]?.message}</p>
                  )}
                </>
              )}
            />
          </div>
        ))}

        <button
          type="submit"
          className={`px-10 py-2.5 rounded-lg font-medium text-sm transition ${
            savedSuccess
              ? 'bg-green-600 text-white'
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {savedSuccess ? 'Saved!' : 'Save'}
        </button>
      </form>
    </div>
  );
}