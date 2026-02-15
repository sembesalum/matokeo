'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

const DEFAULT_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const DEFAULT_SLOTS = [
  '7:00 - 7:40',
  '7:40 - 8:20',
  '8:20 - 9:00',
  '9:00 - 9:40',
  '9:40 - 10:20',
  '10:20 - 11:00',
  '11:00 - 11:40',
  '11:40 - 12:20',
];

export default function TimetableBuildersPage() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [days, setDays] = useState<string[]>(() => [...DEFAULT_DAYS]);
  const [slots, setSlots] = useState<string[]>(() => [...DEFAULT_SLOTS]);
  const [grid, setGrid] = useState<Record<string, string>>({});

  const getCellKey = (dayIndex: number, slotIndex: number) => `${dayIndex}-${slotIndex}`;
  const getCellValue = (dayIndex: number, slotIndex: number) => grid[getCellKey(dayIndex, slotIndex)] ?? '';
  const setCellValue = (dayIndex: number, slotIndex: number, value: string) => {
    setGrid((prev) => ({ ...prev, [getCellKey(dayIndex, slotIndex)]: value }));
  };

  const addDay = useCallback(() => setDays((d) => [...d, '']), []);
  const removeDay = useCallback((i: number) => setDays((d) => d.filter((_, j) => j !== i)), []);
  const updateDay = useCallback((i: number, v: string) => setDays((d) => d.map((x, j) => (j === i ? v : x))), []);

  const addSlot = useCallback(() => setSlots((s) => [...s, '']), []);
  const removeSlot = useCallback((i: number) => setSlots((s) => s.filter((_, j) => j !== i)), []);
  const updateSlot = useCallback((i: number, v: string) => setSlots((s) => s.map((x, j) => (j === i ? v : x))), []);

  const handlePrint = useCallback(() => {
    const rows = slots
      .map(
        (slot, si) =>
          `<tr>
            <td class="time">${slot}</td>
            ${days.map((_, di) => `<td class="cell">${(grid[getCellKey(di, si)] ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>`).join('')}
          </tr>`
      )
      .join('');
    const dayHeaders = days.map((d) => `<th>${(d || 'Day').replace(/</g, '&lt;')}</th>`).join('');
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Timetable${title ? ` - ${title}` : ''}</title>
  <style>
    body { font-family: system-ui, sans-serif; font-size: 11pt; padding: 15mm; }
    h1 { margin: 0 0 4px 0; font-size: 18pt; }
    .subtitle { margin: 0 0 12px 0; color: #555; font-size: 11pt; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #333; padding: 8px; text-align: center; vertical-align: middle; }
    th { background: #eee; font-weight: 600; }
    .time { background: #f5f5f5; font-weight: 500; width: 100px; }
    .cell { min-width: 80px; min-height: 36px; }
  </style>
</head>
<body>
  ${title ? `<h1>${title.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</h1>` : ''}
  ${subtitle ? `<p class="subtitle">${subtitle.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>` : ''}
  <table>
    <thead><tr><th class="time">Time</th>${dayHeaders}</tr></thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;
    const w = window.open('', '_blank', 'noopener,noreferrer');
    if (!w) {
      alert('Please allow pop-ups to export the timetable as PDF. Use the print dialog and choose "Save as PDF".');
      return;
    }
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => {
      w.print();
      w.close();
    }, 300);
  }, [title, subtitle, days, slots, grid]);

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none text-sm';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              ← Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">Timetable Builder</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Build a weekly timetable. Set days, time slots, and fill in subjects. Export as PDF when done.
            </p>
          </div>

          <div className="space-y-6">
            <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Timetable title (optional)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Title</label>
                  <input
                    className={inputClass}
                    placeholder="e.g. Form 4A - Term 1"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Subtitle</label>
                  <input
                    className={inputClass}
                    placeholder="e.g. 2024/2025"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Days</h2>
              <div className="flex flex-wrap gap-2 mb-2">
                {days.map((d, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <input
                      className={`${inputClass} w-28`}
                      placeholder={`Day ${i + 1}`}
                      value={d}
                      onChange={(e) => updateDay(i, e.target.value)}
                    />
                    <button type="button" onClick={() => removeDay(i)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded" title="Remove day">
                      ×
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addDay} className="px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                  + Add day
                </button>
              </div>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Time slots</h2>
              <div className="space-y-2 mb-2">
                {slots.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      className={`${inputClass} max-w-[200px]`}
                      placeholder="e.g. 7:00 - 7:40"
                      value={s}
                      onChange={(e) => updateSlot(i, e.target.value)}
                    />
                    <button type="button" onClick={() => removeSlot(i)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                      ×
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addSlot} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                  + Add time slot
                </button>
              </div>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 overflow-x-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Timetable grid</h2>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm"
                >
                  Export as PDF
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Click each cell to add subject or activity.</p>
              <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 text-sm">
                <thead>
                  <tr>
                    <th className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-2 py-2 text-left font-semibold text-gray-900 dark:text-white w-28">
                      Time
                    </th>
                    {days.map((d, i) => (
                      <th key={i} className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-2 py-2 font-semibold text-gray-900 dark:text-white min-w-[100px]">
                        {d || `Day ${i + 1}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {slots.map((_, si) => (
                    <tr key={si}>
                      <td className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-2 py-1 font-medium text-gray-700 dark:text-gray-300">
                        {slots[si] || `Slot ${si + 1}`}
                      </td>
                      {days.map((_, di) => (
                        <td key={di} className="border border-gray-300 dark:border-gray-600 p-0">
                          <input
                            type="text"
                            className="w-full min-w-[90px] px-2 py-1.5 border-0 bg-transparent focus:ring-2 focus:ring-blue-500 focus:ring-inset dark:bg-gray-800/50 dark:text-white text-sm outline-none"
                            placeholder="Subject"
                            value={getCellValue(di, si)}
                            onChange={(e) => setCellValue(di, si, e.target.value)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Use the print dialog and choose &quot;Save as PDF&quot; to download.</p>
            </section>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}