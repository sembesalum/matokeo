'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const FreeFeatures = [
  'Results Calculations (Matokeo)',
  'Up to 3 classes',
  'CV Builder',
  'Application Letters',
  'Passport Photo Resize',
  'Image format converter',
  'Document converting',
  'Timetable builder',
  'Email support',
];

const ProFeatures = [
  'Everything in Free',
  'Unlimited classes',
  'All current & future tools',
  'Priority support',
  'Bulk export & reports',
  'No ads',
  'Early access to new features',
];

const PRO_PACKAGES = [
  { id: '1m', label: '1 month', price: 9999, total: 9999, perMonth: 9999, popular: false },
  { id: '3m', label: '3 months', price: 26997, total: 26997, perMonth: 8999, popular: true, save: '10%' },
  { id: '6m', label: '6 months', price: 49994, total: 49994, perMonth: 8332, save: '17%' },
  { id: '1y', label: '1 year', price: 89991, total: 89991, perMonth: 7499, save: '25%' },
];

export default function SubscribePage() {
  const [selectedPackage, setSelectedPackage] = useState('3m');
  const proPackage = PRO_PACKAGES.find((p) => p.id === selectedPackage) ?? PRO_PACKAGES[0];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
              Choose your plan
            </h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get more out of Stationary Kiganjani. Start free and upgrade when you need more.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free plan */}
            <div className="relative flex flex-col rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Free
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">0</span>
                  <span className="text-gray-500 dark:text-gray-400">TZS / month</span>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  For teachers and students getting started
                </p>
                <ul className="mt-8 space-y-4">
                  {FreeFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckIcon />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <Link
                    href="/"
                    className="block w-full py-3.5 px-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    Current plan
                  </Link>
                </div>
              </div>
            </div>

            {/* Pro plan */}
            <div className="relative flex flex-col rounded-2xl border-2 border-blue-500 dark:border-blue-400 bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-bl-lg">
                Popular
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Pro
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  For power users and institutions. Choose your billing period:
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  {PRO_PACKAGES.map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`relative text-left p-3 rounded-xl border-2 transition ${
                        selectedPackage === pkg.id
                          ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      {pkg.save && (
                        <span className="absolute top-1.5 right-1.5 text-[10px] font-bold text-green-600 dark:text-green-400">
                          Save {pkg.save}
                        </span>
                      )}
                      <span className="block font-semibold text-gray-900 dark:text-white text-sm">{pkg.label}</span>
                      <span className="block text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                        {pkg.total.toLocaleString()} TZS
                      </span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400">
                        {pkg.perMonth.toLocaleString()} TZS / month
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {proPackage.total.toLocaleString()}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    TZS for {proPackage.label}
                  </span>
                </div>

                <ul className="mt-6 space-y-3">
                  {ProFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckIcon />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <button
                    type="button"
                    className="block w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-center transition shadow-lg hover:shadow-xl"
                  >
                    Upgrade to Pro — {proPackage.label}
                  </button>
                  <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
                    Payment integration coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
