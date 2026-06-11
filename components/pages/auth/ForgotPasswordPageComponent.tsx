'use client';

import { LoginBranding } from '@/components/login-branding';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForgotPasswordMutation } from '@/redux/features/auth/authApi';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';

// Validation schema – only email is needed
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPageComponent() {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onBlur',
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const response = await handleAsyncWithToast(
      () => forgotPassword({ email: data.email }).unwrap(),
      'Sending reset code...',
      undefined,
      undefined,
      true
    );

    if (response?.success) {
      // Success: redirect to OTP verification page for password reset
      router.push(`/auth/verify-code?email=${data.email}&purpose=PASSWORD_RESET`);
    } else {
      // If API returns error without throwing (should not happen with .unwrap, but as fallback)
      setError('root', {
        message: response?.message || 'Failed to send reset code. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden md:flex items-center justify-center bg-white p-8">
        <LoginBranding />
      </div>

      {/* Right Side - Forgot Password Form */}
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
                  Forgot password
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Enter your email address and we&apos;ll send you a code to reset your password.
                </p>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="example@gmail.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={`w-full px-4 py-3 rounded-2xl border ${
                    errors.email ? 'border-red-500' : 'border-gray-200'
                  } bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all`}
                  {...register('email')}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-red-600 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Global Error Message */}
              {errors.root && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600 text-center">
                    {errors.root.message}
                  </p>
                </div>
              )}

              {/* Send Code Button */}
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
                    Sending...
                  </>
                ) : (
                  'Send Code'
                )}
              </button>

              {/* Link back to Login */}
              <div className="text-center pt-2">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors focus:outline-none focus:underline"
                >
                  Remember the password? Log in
                </Link>
              </div>
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