'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Subject } from '@/lib/mockData';

export default function SubjectsTab({ classId }: { classId: string }) {
  const { getClass, addSubject, deleteSubject } = useApp();
  const classData = getClass(classId);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  if (!classData) return null;

  const handleAddSubject = () => {
    if (newSubjectName.trim()) {
      const subject: Subject = {
        id: `sub-${Date.now()}`,
        name: newSubjectName.trim(),
      };
      addSubject(classId, subject);
      setNewSubjectName('');
      setShowAddModal(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Subjects</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors min-h-[44px] w-full sm:w-auto"
        >
          + Add Subject
        </button>
      </div>

      {classData.subjects.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No subjects</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by adding a subject.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classData.subjects.map((subject) => (
            <div
              key={subject.id}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 flex justify-between items-center"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white">{subject.name}</span>
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete ${subject.name}?`)) {
                    deleteSubject(classId, subject.id);
                  }
                }}
                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Subject</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewSubjectName('');
                }}
                className="sm:hidden p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject Name
              </label>
              <input
                type="text"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none text-base"
                placeholder="e.g., Mathematics"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleAddSubject()}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewSubjectName('');
                }}
                className="hidden sm:block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubject}
                className="w-full sm:w-auto px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-semibold min-h-[44px]"
              >
                Add Subject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
