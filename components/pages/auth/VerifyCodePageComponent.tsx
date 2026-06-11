'use client';

import { LoginBranding } from '@/components/login-branding';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOtpMutation, useResendOtpMutation,  } from '@/redux/features/auth/authApi';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/features/auth/authSlice';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import { jwtDecode } from 'jwt-decode';

// Validation schema – accepts 5 or 6 digit code
const verifyCodeSchema = z.object({
  code: z
    .string()
    .min(5, 'Code must be at least 5 digits')
    .max(6, 'Code cannot exceed 6 digits')
    .regex(/^\d+$/, 'Code must contain only numbers'),
});

type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>;

interface DecodedToken {
  id: string;
  email: string;
  role: string;
}

export default function VerifyCodePageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const email = searchParams.get('email') || '';
  const purpose = searchParams.get('purpose') || 'EMAIL_VERIFICATION'; // or PASSWORD_RESET

  const [verifyOtp, { isLoading }] = useOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<VerifyCodeFormData>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: { code: '' },
    mode: 'onBlur',
  });

  // If no email in URL, redirect to forgot password or login
  useEffect(() => {
    if (!email) {
      router.push('/auth/login');
    }
  }, [email, router]);

  const onSubmit = async (data: VerifyCodeFormData) => {
    const response = await handleAsyncWithToast(
      () => verifyOtp({ email, code: data.code, purpose }).unwrap(),
      'Verifying code...',
      undefined,
      undefined,
      true
    );

    if (response?.success && response?.data) {
      const { isVerified, accessToken, refreshToken, resetPasswordToken } = response.data;

      if (purpose === 'EMAIL_VERIFICATION') {
        // Email verification (login/register flow)
        if (isVerified && accessToken) {
          const decoded: DecodedToken = jwtDecode(accessToken);
          dispatch(
            setUser({
              user: {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
                isVerified: true,
              },
              access_token: accessToken,
              refresh_token: refreshToken,
            })
          );
          // Redirect to dashboard after successful verification
          router.push('/dashboard/users');
        } else {
          setError('root', { message: 'Verification failed. Please try again.' });
        }
      } else if (purpose === 'PASSWORD_RESET') {
        // Password reset flow – redirect to reset password page with token
        if (resetPasswordToken) {
          router.push(`/auth/reset-password?email=${encodeURIComponent(email)}&token=${resetPasswordToken}`);
        } else {
          setError('root', { message: 'Invalid reset token. Please try again.' });
        }
      }
    } else {
      setError('root', { message: response?.message || 'Invalid or expired code.' });
    }
  };

  const handleResendCode = async () => {
    await handleAsyncWithToast(
      () => resendOtp({ email, purpose }).unwrap(),
      'Resending code...',
      'A new code has been sent to your email.',
      undefined,
      true
    );
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden md:flex items-center justify-center bg-white p-8">
        <LoginBranding />
      </div>

      {/* Right Side - Verification Form */}
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
                  Check your Email
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  We&apos;ve sent a 5‑digit verification code to <strong>{email}</strong>.
                  Enter it below to {purpose === 'PASSWORD_RESET' ? 'reset your password' : 'verify your account'}.
                </p>
              </div>

              {/* Code Input */}
              <div className="space-y-2">
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="12345"
                  aria-invalid={!!errors.code}
                  aria-describedby={errors.code ? 'code-error' : undefined}
                  className={`w-full px-4 py-3 rounded-2xl border ${
                    errors.code ? 'border-red-500' : 'border-gray-200'
                  } bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all text-center text-2xl tracking-widest`}
                  {...register('code')}
                  disabled={isLoading}
                />
                {errors.code && (
                  <p id="code-error" className="text-sm text-red-600 mt-1">
                    {errors.code.message}
                  </p>
                )}
              </div>

              {/* General Error Message */}
              {errors.root && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600 text-center">{errors.root.message}</p>
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
                    Verifying...
                  </>
                ) : (
                  'Submit'
                )}
              </button>

              {/* Resend Code & Back to Login Links */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:underline"
                >
                  {isResending ? 'Sending...' : "Didn't receive a code? Resend"}
                </button>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors focus:outline-none focus:underline"
                >
                  Back to Login
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