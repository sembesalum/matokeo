'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';

export default function ExportTab({ classId }: { classId: string }) {
  const { getClass } = useApp();
  const classData = getClass(classId);
  const [showPreview, setShowPreview] = useState(false);
  const [exportType, setExportType] = useState<'excel' | 'pdf' | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!classData) return null;

  const handleExport = (type: 'excel' | 'pdf') => {
    setExportType(type);
    setShowPreview(true);
  };

  const handleConfirmExport = () => {
    setShowPreview(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Export Results</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Export class results in various formats. (UI simulation only)
        </p>
      </div>

      {showSuccess && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400">
            ✅ Export generated successfully!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg mr-4">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Export to Excel</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Download results as .xlsx file</p>
            </div>
          </div>
          <button
            onClick={() => handleExport('excel')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Export Excel
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg mr-4">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Export to PDF</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Download results as .pdf file</p>
            </div>
          </div>
          <button
            onClick={() => handleExport('pdf')}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Export Preview - {exportType?.toUpperCase()}
            </h2>
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <strong>Class:</strong> {classData.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <strong>Students:</strong> {(classData.students ?? []).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <strong>Subjects:</strong> {(classData.subjects ?? []).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Format:</strong> {exportType === 'excel' ? '.xlsx' : '.pdf'}
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmExport}
                className={`px-4 py-2 text-white rounded-lg transition ${
                  exportType === 'excel'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
