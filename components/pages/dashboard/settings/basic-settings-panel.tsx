/* eslint-disable @next/next/no-img-element */
'use client';

import { useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Select } from 'antd';
import { Pencil, Info } from 'lucide-react';

const COUNTRIES = ['USA', 'UK', 'Canada', 'Australia', 'Bangladesh', 'India', 'Germany'];

const CITIES_BY_COUNTRY: Record<string, string[]> = {
  USA: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
  UK: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow'],
  Canada: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
  Australia: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
  Bangladesh: ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna'],
  India: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'],
  Germany: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'],
};

const schema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
});

type FormData = z.infer<typeof schema>;

export function BasicSettingsPanel() {
  const [photoUrl, setPhotoUrl] = useState('/shepherd-1.png');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: 'Bryan Adams',
      country: 'USA',
      city: 'New York',
    },
  });

  const selectedCountry = watch('country');
  const cities = CITIES_BY_COUNTRY[selectedCountry] || [];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith('image/')) {
      setPhotoUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data: FormData) => {
    console.log('Saved:', data, { photoUrl });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-base font-semibold text-gray-900">Profile Information</h3>
        <Info size={16} className="text-gray-400" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Photo Profile */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Photo Profile
          </label>
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
              <img
                src={photoUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-7 h-7 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-50 transition"
            >
              <Pencil size={13} className="text-gray-600" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Display Name
          </label>
          <Controller
            name="displayName"
            control={control}
            render={({ field }) => (
              <>
                <input
                  {...field}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition ${
                    errors.displayName ? 'border-red-400' : 'border-gray-300'
                  }`}
                />
                {errors.displayName && (
                  <p className="mt-1 text-xs text-red-500">{errors.displayName.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* Email — read only */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input
            type="email"
            defaultValue="bryanadams@gmail.com"
            disabled
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-400 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Country + City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  className="w-full"
                  size="large"
                  onChange={(val) => {
                    field.onChange(val);
                    setValue('city', CITIES_BY_COUNTRY[val]?.[0] || '');
                  }}
                  options={COUNTRIES.map((c) => ({ label: c, value: c }))}
                  status={errors.country ? 'error' : ''}
                />
              )}
            />
            {errors.country && (
              <p className="mt-1 text-xs text-red-500">{errors.country.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  className="w-full"
                  size="large"
                  options={cities.map((c) => ({ label: c, value: c }))}
                  status={errors.city ? 'error' : ''}
                />
              )}
            />
            {errors.city && (
              <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>
            )}
          </div>
        </div>

        {/* Save */}
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