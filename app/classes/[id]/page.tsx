'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import StudentsTab from '@/components/class-workspace/StudentsTab';
import SubjectsTab from '@/components/class-workspace/SubjectsTab';
import GradesTab from '@/components/class-workspace/GradesTab';
import MarksTab from '@/components/class-workspace/MarksTab';
import ResultsTab from '@/components/class-workspace/ResultsTab';
import ExportTab from '@/components/class-workspace/ExportTab';

const tabs = [
  { id: 'students', label: 'Students' },
  { id: 'subjects', label: 'Subjects' },
  { id: 'grades', label: 'Grades' },
  { id: 'marks', label: 'Marks' },
  { id: 'results', label: 'Results' },
  { id: 'export', label: 'Export' },
];

export default function ClassWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;
  const { getClass, loadClass } = useApp();
  const classData = getClass(classId);
  const [activeTab, setActiveTab] = useState('students');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClass = async () => {
      if (!classData) {
        setLoading(true);
        try {
          await loadClass(classId);
        } catch (err) {
          console.error('Failed to load class:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchClass();
  }, [classId, classData, loadClass]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading class...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const currentClassData = getClass(classId);
  if (!currentClassData) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Class not found</h2>
            <button
              onClick={() => router.push('/classes')}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Go back to classes
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/classes')}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-4 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Classes
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {currentClassData.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage students, subjects, grades, and results
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex overflow-x-auto scrollbar-hide -mx-4 sm:mx-0 px-4 sm:px-0" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors min-w-fit ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6">
              {activeTab === 'students' && <StudentsTab classId={classId} />}
              {activeTab === 'subjects' && <SubjectsTab classId={classId} />}
              {activeTab === 'grades' && <GradesTab classId={classId} />}
              {activeTab === 'marks' && <MarksTab classId={classId} />}
              {activeTab === 'results' && <ResultsTab classId={classId} />}
              {activeTab === 'export' && <ExportTab classId={classId} />}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
