'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getCategoryBySlug } from '@/lib/categories';

export default function ToolPlaceholderPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const category = slug ? getCategoryBySlug(slug) : null;
  const title = category?.title ?? slug?.replace(/-/g, ' ') ?? 'Tool';
  const description = category?.description ?? 'This tool is coming soon.';

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 md:p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {description}
            </p>
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-8">
              This tool is coming soon. Check back later.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
              >
                Back to Home
              </Link>
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition"
              >
                Go back
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
