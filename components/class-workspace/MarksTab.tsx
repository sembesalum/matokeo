'use client';

import { useApp } from '@/contexts/AppContext';
import { Mark } from '@/lib/mockData';

export default function MarksTab({ classId }: { classId: string }) {
  const { getClass, updateMark } = useApp();
  const classData = getClass(classId);

  if (!classData) return null;

  const getMark = (studentId: string, subjectId: string): number => {
    const mark = classData.marks.find(
      m => m.studentId === studentId && m.subjectId === subjectId
    );
    return mark?.mark ?? 0;
  };

  const handleMarkChange = (studentId: string, subjectId: string, value: string) => {
    const markValue = parseInt(value) || 0;
    if (markValue >= 0 && markValue <= 100) {
      const mark: Mark = { studentId, subjectId, mark: markValue };
      updateMark(classId, mark);
    }
  };

  const getGrade = (mark: number): string => {
    const rule = classData.gradeRules.find(r => mark >= r.fromMark && mark <= r.toMark);
    return rule?.grade || '-';
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Marks Entry</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Enter marks for each student and subject. Grades are calculated automatically.
        </p>
      </div>

      {(classData.students ?? []).length === 0 || (classData.subjects ?? []).length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            {(classData.students ?? []).length === 0 && (classData.subjects ?? []).length === 0
              ? 'Please add students and subjects first.'
              : (classData.students ?? []).length === 0
              ? 'Please add students first.'
              : 'Please add subjects first.'}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {(classData.students ?? []).map((student) => (
              <div
                key={student.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
              >
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  {student.name}
                </h3>
                <div className="space-y-3">
                  {(classData.subjects ?? []).map((subject) => {
                    const mark = getMark(student.id, subject.id);
                    const grade = mark > 0 ? getGrade(mark) : '-';
                    return (
                      <div key={subject.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{subject.name}</p>
                          {mark > 0 && (
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Grade: {grade}</p>
                          )}
                        </div>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={mark || ''}
                          onChange={(e) => handleMarkChange(student.id, subject.id, e.target.value)}
                          className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none text-base text-center min-h-[44px]"
                          placeholder="0"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Tablet/Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="sticky left-0 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600">
                      Student
                    </th>
                    {(classData.subjects ?? []).map((subject) => (
                      <th
                        key={subject.id}
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[120px]"
                      >
                        {subject.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {(classData.students ?? []).map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="sticky left-0 z-10 px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-600">
                        {student.name}
                      </td>
                      {(classData.subjects ?? []).map((subject) => {
                        const mark = getMark(student.id, subject.id);
                        const grade = mark > 0 ? getGrade(mark) : '-';
                        return (
                          <td key={subject.id} className="px-4 py-3 whitespace-nowrap">
                            <div className="flex flex-col items-center gap-1">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={mark || ''}
                                onChange={(e) => handleMarkChange(student.id, subject.id, e.target.value)}
                                className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none text-sm text-center"
                                placeholder="0"
                              />
                              {mark > 0 && (
                                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                                  {grade}
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
