'use client';

import { LoginBranding } from '@/components/login-branding';
import { Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useResetPasswordMutation } from '@/redux/features/auth/authApi';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';

// Password validation schema
const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  // Redirect if missing required params
  useEffect(() => {
    if (!email || !token) {
      router.push('/auth/login');
    }
  }, [email, token, router]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError(null);

    const response = await handleAsyncWithToast(
      () => resetPassword({ email, token, password: data.newPassword }).unwrap(),
      'Resetting password...',
      'Password reset successful!',
      undefined,
      true
    );

    if (response?.success) {
      // Redirect to login page after success
      router.push('/auth/login?reset=success');
    } else {
      setError(response?.message || 'Failed to reset password. Please try again.');
      setFormError('root', { message: response?.message || 'Failed to reset password' });
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden md:flex items-center justify-center bg-white p-8">
        <LoginBranding />
      </div>

      {/* Right Side - Reset Password Form */}
      <div className="flex flex-col items-center justify-center bg-gray-100 min-h-screen p-4 sm:p-6 md:p-8">
        <div className="flex flex-col items-center justify-between w-full max-w-md">
          {/* Mobile Branding */}
          <div className="md:hidden mb-8 sm:mb-12">
            <LoginBranding />
          </div>

          {/* Form Card */}
          <div className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Input the new password
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Create a strong password for your account.
                </p>
                {email && (
                  <p className="text-xs text-gray-500">
                    Resetting password for: <span className="font-medium">{email}</span>
                  </p>
                )}
              </div>

              <div className="space-y-4">
                {/* New Password Field */}
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="••••••"
                      aria-invalid={!!errors.newPassword}
                      aria-describedby={errors.newPassword ? 'new-password-error' : undefined}
                      className={`w-full px-4 py-3 rounded-2xl border ${
                        errors.newPassword ? 'border-red-500' : 'border-gray-200'
                      } bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all pr-12`}
                      {...register('newPassword')}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
                      aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                      disabled={isLoading}
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p id="new-password-error" className="text-sm text-red-600 mt-1">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm new password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="••••••"
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                      className={`w-full px-4 py-3 rounded-2xl border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                      } bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all pr-12`}
                      {...register('confirmPassword')}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p id="confirm-password-error" className="text-sm text-red-600 mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* General Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600 text-center">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-black text-white font-semibold rounded-2xl hover:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed text-base sm:text-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Resetting...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <p className="text-gray-500 text-xs sm:text-sm mt-8 text-center">
            © 2026 My Shepherd. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}