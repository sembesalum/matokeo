'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';

export default function ResultsTab({ classId }: { classId: string }) {
  const { getClass } = useApp();
  const classData = getClass(classId);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');

  if (!classData) return null;

  const getMark = (studentId: string, subjectId: string): number => {
    const mark = classData.marks.find(
      m => m.studentId === studentId && m.subjectId === subjectId
    );
    return mark?.mark ?? 0;
  };

  const getGrade = (mark: number): { grade: string; remark: string } => {
    const rule = classData.gradeRules.find(r => mark >= r.fromMark && mark <= r.toMark);
    return rule ? { grade: rule.grade, remark: rule.remark } : { grade: '-', remark: '-' };
  };

  const calculateStudentResults = () => {
    return classData.students
      .filter(student => genderFilter === 'all' || student.gender === genderFilter)
      .map(student => {
        const marks = classData.subjects.map(subject => getMark(student.id, subject.id));
        const totalMarks = marks.reduce((sum, m) => sum + m, 0);
        const average = marks.length > 0 ? Math.round((totalMarks / marks.length) * 10) / 10 : 0;
        const overallGrade = getGrade(average);
        return {
          student,
          totalMarks,
          average,
          grade: overallGrade.grade,
          remark: overallGrade.remark,
          subjectMarks: marks,
        };
      })
      .sort((a, b) => b.average - a.average)
      .map((result, index) => ({ ...result, position: index + 1 }));
  };

  const calculateSubjectResults = (subjectId: string) => {
    return classData.students
      .filter(student => genderFilter === 'all' || student.gender === genderFilter)
      .map(student => {
        const mark = getMark(student.id, subjectId);
        const grade = getGrade(mark);
        return {
          student,
          mark,
          grade: grade.grade,
          remark: grade.remark,
        };
      })
      .sort((a, b) => b.mark - a.mark)
      .map((result, index) => ({ ...result, position: index + 1 }));
  };

  const overallResults = calculateStudentResults();
  const subjectResults = selectedSubject !== 'all' ? calculateSubjectResults(selectedSubject) : [];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Results</h2>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              View
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none"
            >
              <option value="all">Overall Results</option>
              {classData.subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gender Filter
            </label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none"
            >
              <option value="all">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
      </div>

      {selectedSubject === 'all' ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total Marks
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Average
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Overall Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Remark
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {overallResults.map((result) => (
                <tr
                  key={result.student.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    result.position <= 3 ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-bold ${
                        result.position === 1
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : result.position === 2
                          ? 'text-gray-600 dark:text-gray-400'
                          : result.position === 3
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-gray-500 dark:text-gray-500'
                      }`}
                    >
                      {result.position === 1 && '🥇'}
                      {result.position === 2 && '🥈'}
                      {result.position === 3 && '🥉'}
                      {result.position > 3 && result.position}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {result.student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {result.student.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 dark:text-white">
                    {result.totalMarks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-900 dark:text-white">
                    {result.average}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-blue-600 dark:text-blue-400">
                    {result.grade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {result.remark}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Mark
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Remark
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {subjectResults.map((result) => (
                <tr
                  key={result.student.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    result.position <= 3 ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-bold ${
                        result.position === 1
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : result.position === 2
                          ? 'text-gray-600 dark:text-gray-400'
                          : result.position === 3
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-gray-500 dark:text-gray-500'
                      }`}
                    >
                      {result.position === 1 && '🥇'}
                      {result.position === 2 && '🥈'}
                      {result.position === 3 && '🥉'}
                      {result.position > 3 && result.position}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {result.student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {result.student.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-900 dark:text-white">
                    {result.mark}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-blue-600 dark:text-blue-400">
                    {result.grade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {result.remark}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
