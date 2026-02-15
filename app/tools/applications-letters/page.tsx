'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LetterPreview from '@/components/application-letter/LetterPreview';
import { printLetter } from '@/components/application-letter/PrintLetter';
import type { ApplicationLetterData } from '@/lib/applicationLetterTypes';
import { defaultLetterData, defaultRecipient } from '@/lib/applicationLetterTypes';

const inputClass =
  'w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none';
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

export default function ApplicationLettersPage() {
  const [data, setData] = useState<ApplicationLetterData>(() => ({ ...defaultLetterData }));

  const update = (key: keyof ApplicationLetterData, value: string | null) => {
    setData((d) => ({ ...d, [key]: value }));
  };
  const updateApplicant = (key: keyof ApplicationLetterData['applicant'], value: string) => {
    setData((d) => ({ ...d, applicant: { ...d.applicant, [key]: value } }));
  };
  const updateRecipient = (key: keyof ApplicationLetterData['recipient'], value: string) => {
    setData((d) => ({ ...d, recipient: { ...d.recipient, [key]: value } }));
  };
  const updateRecipient2 = (key: keyof ApplicationLetterData['recipient'], value: string) => {
    setData((d) => ({
      ...d,
      recipient2: d.recipient2 ? { ...d.recipient2, [key]: value } : { ...defaultRecipient, [key]: value },
    }));
  };
  const addRecipient2 = () => setData((d) => ({ ...d, recipient2: d.recipient2 || { ...defaultRecipient } }));
  const removeRecipient2 = () => setData((d) => ({ ...d, recipient2: null }));

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              ← Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">Application Letter</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Match the example format. Only typed fields appear in the PDF.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-[420px] xl:w-[480px] shrink-0 space-y-6">
              <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Date & your details (top right)</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Date</label>
                    <input type="date" className={inputClass} value={data.date} onChange={(e) => update('date', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Full name</label>
                    <input className={inputClass} placeholder="e.g. INNOCENT W. GWAMBIYE" value={data.applicant.name} onChange={(e) => updateApplicant('name', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Institution</label>
                    <input className={inputClass} placeholder="e.g. SOKOINE UNIVERSITY OF AGRICULTURE (SUA)" value={data.applicant.institution} onChange={(e) => updateApplicant('institution', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Address</label>
                    <input className={inputClass} placeholder="e.g. PO BOX 3000" value={data.applicant.address} onChange={(e) => updateApplicant('address', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>City</label>
                    <input className={inputClass} placeholder="e.g. MOROGORO" value={data.applicant.city} onChange={(e) => updateApplicant('city', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Country</label>
                    <input className={inputClass} placeholder="e.g. TANZANIA" value={data.applicant.country} onChange={(e) => updateApplicant('country', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input type="email" className={inputClass} placeholder="your@email.com" value={data.applicant.email} onChange={(e) => updateApplicant('email', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input className={inputClass} placeholder="e.g. +255 625 058 667" value={data.applicant.phone} onChange={(e) => updateApplicant('phone', e.target.value)} />
                  </div>
                </div>
              </section>

              <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recipient (left, below your details)</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Title</label>
                    <input className={inputClass} placeholder="e.g. THE PRODUCTION MANAGER" value={data.recipient.title} onChange={(e) => updateRecipient('title', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Company / Organization</label>
                    <input className={inputClass} placeholder="e.g. FIDES TANZANIA LTD" value={data.recipient.companyName} onChange={(e) => updateRecipient('companyName', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Address</label>
                    <textarea className={`${inputClass} min-h-[80px] resize-y`} placeholder="P.O.BOX 1304, ARUSHA, TANZANIA" value={data.recipient.address} onChange={(e) => updateRecipient('address', e.target.value)} rows={3} />
                  </div>
                  {!data.recipient2 ? (
                    <button type="button" onClick={addRecipient2} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                      + Add second recipient
                    </button>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Second recipient</p>
                      <div className="space-y-3 pl-2 border-l-2 border-gray-200 dark:border-gray-600">
                        <div>
                          <label className={labelClass}>Title</label>
                          <input className={inputClass} placeholder="e.g. THE HUMAN RESOURCES MANAGER" value={data.recipient2.title} onChange={(e) => updateRecipient2('title', e.target.value)} />
                        </div>
                        <div>
                          <label className={labelClass}>Company</label>
                          <input className={inputClass} value={data.recipient2.companyName} onChange={(e) => updateRecipient2('companyName', e.target.value)} />
                        </div>
                        <div>
                          <label className={labelClass}>Address</label>
                          <textarea className={`${inputClass} min-h-[60px] resize-y`} value={data.recipient2.address} onChange={(e) => updateRecipient2('address', e.target.value)} rows={2} />
                        </div>
                        <button type="button" onClick={removeRecipient2} className="text-xs text-red-600 dark:text-red-400 hover:underline">Remove second recipient</button>
                      </div>
                    </>
                  )}
                </div>
              </section>

              <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Salutation & reference</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Salutation</label>
                    <input className={inputClass} placeholder="Dear sir," value={data.salutation} onChange={(e) => update('salutation', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>REF: (centered line)</label>
                    <input className={inputClass} placeholder="e.g. APPLICATION FOR INTERNSHIP OPPORTUNITY" value={data.referenceLine} onChange={(e) => update('referenceLine', e.target.value)} />
                  </div>
                </div>
              </section>

              <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Letter body (3 paragraphs)</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Paragraph 1 (introduction)</label>
                    <textarea className={`${inputClass} min-h-[100px] resize-y`} placeholder="I am writing to apply for..." value={data.bodyParagraph1} onChange={(e) => update('bodyParagraph1', e.target.value)} rows={4} />
                  </div>
                  <div>
                    <label className={labelClass}>Paragraph 2</label>
                    <textarea className={`${inputClass} min-h-[100px] resize-y`} placeholder="My experience and qualifications..." value={data.bodyParagraph2} onChange={(e) => update('bodyParagraph2', e.target.value)} rows={4} />
                  </div>
                  <div>
                    <label className={labelClass}>Paragraph 3</label>
                    <textarea className={`${inputClass} min-h-[100px] resize-y`} placeholder="I look forward to..." value={data.bodyParagraph3} onChange={(e) => update('bodyParagraph3', e.target.value)} rows={4} />
                  </div>
                </div>
              </section>

              <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Closing</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Closing line (optional)</label>
                    <input className={inputClass} placeholder="e.g. Looking forward to your positive response." value={data.closingLine} onChange={(e) => update('closingLine', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Closing word</label>
                    <input className={inputClass} placeholder="e.g. Sincerely," value={data.closing} onChange={(e) => update('closing', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Your name (signature block)</label>
                    <input className={inputClass} placeholder="e.g. INNOCENT W. GWAMBIYE" value={data.signatureName} onChange={(e) => update('signatureName', e.target.value)} />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => printLetter(data)}
                  className="mt-4 w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition"
                >
                  Export as PDF
                </button>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Only the fields you typed will appear in the PDF. Choose &quot;Save as PDF&quot; in the print dialog.</p>
              </section>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Live preview</p>
              <div className="sticky top-6">
                <LetterPreview data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}