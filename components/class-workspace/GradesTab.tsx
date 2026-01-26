'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { GradeRule } from '@/lib/mockData';

export default function GradesTab({ classId }: { classId: string }) {
  const { getClass, updateGradeRules } = useApp();
  const classData = getClass(classId);
  const [editingRule, setEditingRule] = useState<GradeRule | null>(null);
  const [previewMark, setPreviewMark] = useState('');

  if (!classData) return null;

  const handleUpdateRule = (ruleId: string, updates: Partial<GradeRule>) => {
    const updatedRules = classData.gradeRules.map(r =>
      r.id === ruleId ? { ...r, ...updates } : r
    );
    updateGradeRules(classId, updatedRules);
  };

  const handleAddRule = () => {
    const newRule: GradeRule = {
      id: `g-${Date.now()}`,
      fromMark: 0,
      toMark: 0,
      grade: '',
      points: 0,
      remark: '',
    };
    updateGradeRules(classId, [...classData.gradeRules, newRule]);
  };

  const handleDeleteRule = (ruleId: string) => {
    if (confirm('Are you sure you want to delete this grade rule?')) {
      updateGradeRules(classId, classData.gradeRules.filter(r => r.id !== ruleId));
    }
  };

  const validateRanges = (rules: GradeRule[]): boolean => {
    const sorted = [...rules].sort((a, b) => a.fromMark - b.fromMark);
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].toMark >= sorted[i + 1].fromMark) {
        return false;
      }
    }
    return true;
  };

  const getGradeForMark = (mark: number): GradeRule | null => {
    return classData.gradeRules.find(r => mark >= r.fromMark && mark <= r.toMark) || null;
  };

  const sortedRules = [...classData.gradeRules].sort((a, b) => b.fromMark - a.fromMark);
  const isValid = validateRanges(classData.gradeRules);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Grading Rules</h2>
        <button
          onClick={handleAddRule}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors min-h-[44px] w-full sm:w-auto"
        >
          + Add Rule
        </button>
      </div>

      {!isValid && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">
            ⚠️ Warning: Grade ranges are overlapping. Please fix the ranges.
          </p>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Preview Grade (Enter a mark)
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            min="0"
            max="100"
            value={previewMark}
            onChange={(e) => setPreviewMark(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none text-base min-h-[44px]"
            placeholder="Enter mark (0-100)"
          />
          {previewMark && (
            <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center min-h-[44px]">
              {(() => {
                const mark = parseInt(previewMark);
                if (isNaN(mark) || mark < 0 || mark > 100) {
                  return <span className="text-gray-600 dark:text-gray-400">Invalid mark</span>;
                }
                const grade = getGradeForMark(mark);
                if (grade) {
                  return (
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">
                      Grade {grade.grade} ({grade.remark})
                    </span>
                  );
                }
                return <span className="text-gray-600 dark:text-gray-400">No grade found</span>;
              })()}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                From Mark
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                To Mark
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Grade Letter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Points
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Remark
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedRules.map((rule) => (
              <tr key={rule.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={rule.fromMark}
                    onChange={(e) => handleUpdateRule(rule.id, { fromMark: parseInt(e.target.value) || 0 })}
                    className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none text-sm"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={rule.toMark}
                    onChange={(e) => handleUpdateRule(rule.id, { toMark: parseInt(e.target.value) || 0 })}
                    className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none text-sm"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={rule.grade}
                    onChange={(e) => handleUpdateRule(rule.id, { grade: e.target.value })}
                    className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none text-sm"
                    placeholder="A"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={rule.points}
                    onChange={(e) => handleUpdateRule(rule.id, { points: parseInt(e.target.value) || 0 })}
                    className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none text-sm"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={rule.remark}
                    onChange={(e) => handleUpdateRule(rule.id, { remark: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none text-sm"
                    placeholder="Excellent"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
