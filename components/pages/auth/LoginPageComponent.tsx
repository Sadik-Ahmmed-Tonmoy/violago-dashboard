'use client';

import { LoginBranding } from '@/components/login-branding';
import { useLoginMutation } from '@/redux/features/auth/authApi';
import { logout, setUser } from '@/redux/features/auth/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import { zodResolver } from '@hookform/resolvers/zod';
import { jwtDecode } from 'jwt-decode';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(50, 'Password is too long'),
  keepMeLogin: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;
interface DecodedToken { id: string; email: string; role: string; }

export default function LoginPageComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMutation, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset, // ✅ added missing reset
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', keepMeLogin: false },
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log("🔐 Login attempt with:", data.email);
    const response = await handleAsyncWithToast(
      () => loginMutation(data).unwrap(),
      'Logging in...',
      undefined,
      undefined,
      true
    );

    console.log("📦 Full response:", response);

    if (response?.success) {
      const loginData = response.data;
      console.log("✅ Login data:", loginData);

      // Case: unverified user
      if (loginData.isVerified === false) {
        console.log("⚠️ User not verified, redirecting to OTP");
        router.push(`/auth/verify-code?email=${encodeURIComponent(loginData.email)}&purpose=EMAIL_VERIFICATION`);
        return;
      }

      // Case: verified user with tokens
      if (loginData.isVerified === true && loginData.accessToken) {
        try {
          const decoded = jwtDecode<DecodedToken>(loginData.accessToken);
          console.log("🔓 Decoded token:", decoded);
          dispatch(
            setUser({
              user: {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
                isVerified: true,
              },
              access_token: loginData.accessToken,
              refresh_token: loginData.refreshToken,
            })
          );
          console.log("✅ User data dispatched to Redux");

          // Redirect based on role
          if (decoded.role === 'SUPER_ADMIN' || decoded.role === 'ADMIN') {
            router.push('/dashboard/users');
          } else {
            await dispatch(logout());
            toast.error('You are not authorized to access this page');
            reset(); // ✅ now works
            router.replace('/auth/login');
          }
          return;
        } catch (decodeError) {
          console.error("❌ JWT decode error:", decodeError);
          setError('root', { message: 'Invalid token received' });
        }
      } else {
        console.error("❌ Unexpected login data structure:", loginData);
        setError('root', { message: 'Unexpected response from server' });
      }
    } else {
      console.error("❌ Login failed, response:", response);
      setError('root', { message: response?.message || 'Invalid email or password' });
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex items-center justify-center bg-white p-8">
        <LoginBranding />
      </div>
      <div className="flex flex-col items-center justify-center bg-gray-100 min-h-screen p-4 sm:p-6 md:p-8">
        <div className="flex flex-col items-center justify-between w-full max-w-md">
          <div className="md:hidden mb-8 sm:mb-12">
            <LoginBranding />
          </div>
          <div className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Login</h1>
                <p className="text-gray-600 text-sm sm:text-base">Let&apos;s login into your account first</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="example@gmail.com"
                    aria-invalid={!!errors.email}
                    className={`w-full px-4 py-3 rounded-2xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all`}
                    {...register('email')}
                    disabled={isLoading}
                  />
                  {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••"
                      aria-invalid={!!errors.password}
                      className={`w-full px-4 py-3 rounded-2xl border ${errors.password ? 'border-red-500' : 'border-gray-200'} bg-white text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all pr-12`}
                      {...register('password')}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" {...register('keepMeLogin')} className="rounded border-gray-300 text-black focus:ring-black" />
                    Remember me
                  </label>
                  <Link href="/auth/forgot-password" className="text-sm font-medium text-gray-900 hover:text-gray-700">Forgot password?</Link>
                </div>
              </div>
              {errors.root && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600 text-center">{errors.root.message}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-black text-white font-semibold rounded-2xl hover:bg-gray-900 disabled:opacity-70 disabled:cursor-not-allowed text-base sm:text-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Logging in...
                  </>
                ) : (
                  'Log in'
                )}
              </button>
            </form>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm mt-8 text-center">© 2026 My Shepherd. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}