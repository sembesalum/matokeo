'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import CVPreview from '@/components/cv-builder/CVPreview';
import { printCV } from '@/components/cv-builder/PrintCV';
import type {
  CVData,
  CVPersonal,
  CVEducation,
  CVExperience,
  CVSkillGroup,
  CVCertification,
  CVLanguage,
  CVReference,
} from '@/lib/cvTypes';
import {
  defaultCVData,
  defaultPersonal,
  defaultEducation,
  defaultExperience,
  defaultSkillGroup,
  defaultCertification,
  defaultLanguage,
  defaultReference,
} from '@/lib/cvTypes';

const STEPS = [
  { id: 'personal', title: 'Personal info', short: 'Personal' },
  { id: 'summary', title: 'Professional summary', short: 'Summary' },
  { id: 'education', title: 'Education', short: 'Education' },
  { id: 'experience', title: 'Experience', short: 'Experience' },
  { id: 'skills', title: 'Skills', short: 'Skills' },
  { id: 'additional', title: 'Certifications & more', short: 'More' },
  { id: 'preview', title: 'Preview & export', short: 'Preview' },
];

export default function CVBuilderPage() {
  const [data, setData] = useState<CVData>(() => ({ ...defaultCVData }));
  const [step, setStep] = useState(0);
  const progress = ((step + 1) / STEPS.length) * 100;

  const updatePersonal = useCallback((v: Partial<CVPersonal>) => {
    setData((d) => ({ ...d, personal: { ...d.personal, ...v } }));
  }, []);

  const updateSummary = useCallback((v: string) => {
    setData((d) => ({ ...d, summary: v }));
  }, []);

  const setEducation = useCallback((list: CVEducation[]) => {
    setData((d) => ({ ...d, education: list }));
  }, []);

  const setExperience = useCallback((list: CVExperience[]) => {
    setData((d) => ({ ...d, experience: list }));
  }, []);

  const setSkills = useCallback((list: CVSkillGroup[]) => {
    setData((d) => ({ ...d, skills: list }));
  }, []);

  const setCertifications = useCallback((list: CVCertification[]) => {
    setData((d) => ({ ...d, certifications: list }));
  }, []);

  const setLanguages = useCallback((list: CVLanguage[]) => {
    setData((d) => ({ ...d, languages: list }));
  }, []);

  const setReferences = useCallback((list: CVReference[]) => {
    setData((d) => ({ ...d, references: list }));
  }, []);

  const addEducation = () => setEducation([...data.education, defaultEducation()]);
  const removeEducation = (id: string) => setEducation(data.education.filter((e) => e.id !== id));
  const updateEducation = (id: string, v: Partial<CVEducation>) => {
    setEducation(data.education.map((e) => (e.id === id ? { ...e, ...v } : e)));
  };

  const addExperience = () => setExperience([...data.experience, defaultExperience()]);
  const removeExperience = (id: string) => setExperience(data.experience.filter((e) => e.id !== id));
  const updateExperience = (id: string, v: Partial<CVExperience>) => {
    setExperience(data.experience.map((e) => (e.id === id ? { ...e, ...v } : e)));
  };

  const addSkillGroup = () => setSkills([...data.skills, defaultSkillGroup()]);
  const removeSkillGroup = (id: string) => setSkills(data.skills.filter((s) => s.id !== id));
  const updateSkillGroup = (id: string, v: Partial<CVSkillGroup>) => {
    setSkills(data.skills.map((s) => (s.id === id ? { ...s, ...v } : s)));
  };
  const addSkillItem = (groupId: string) => {
    setSkills(data.skills.map((s) => (s.id === groupId ? { ...s, items: [...s.items, ''] } : s)));
  };
  const updateSkillItem = (groupId: string, idx: number, value: string) => {
    setSkills(data.skills.map((s) => (s.id === groupId ? { ...s, items: s.items.map((it, i) => (i === idx ? value : it)) } : s)));
  };
  const removeSkillItem = (groupId: string, idx: number) => {
    setSkills(data.skills.map((s) => (s.id === groupId ? { ...s, items: s.items.filter((_, i) => i !== idx) } : s)));
  };

  const addCertification = () => setCertifications([...data.certifications, defaultCertification()]);
  const removeCertification = (id: string) => setCertifications(data.certifications.filter((c) => c.id !== id));
  const updateCertification = (id: string, v: Partial<CVCertification>) => {
    setCertifications(data.certifications.map((c) => (c.id === id ? { ...c, ...v } : c)));
  };

  const addLanguage = () => setLanguages([...data.languages, defaultLanguage()]);
  const removeLanguage = (id: string) => setLanguages(data.languages.filter((l) => l.id !== id));
  const updateLanguage = (id: string, v: Partial<CVLanguage>) => {
    setLanguages(data.languages.map((l) => (l.id === id ? { ...l, ...v } : l)));
  };

  const addReference = () => setReferences([...data.references, defaultReference()]);
  const removeReference = (id: string) => setReferences(data.references.filter((r) => r.id !== id));
  const updateReference = (id: string, v: Partial<CVReference>) => {
    setReferences(data.references.map((r) => (r.id === id ? { ...r, ...v } : r)));
  };

  const inputClass =
    'w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: form */}
            <div className="lg:w-[420px] xl:w-[480px] shrink-0">
              <div className="mb-6 flex items-center justify-between">
                <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  ← Back to Home
                </Link>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Step {step + 1} of {STEPS.length}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-8">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Step tabs (compact) */}
              <div className="flex flex-wrap gap-1 mb-6">
                {STEPS.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStep(i)}
                    className={`px-2 py-1 rounded text-xs font-medium transition ${
                      step === i
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {s.short}
                  </button>
                ))}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                {step === 0 && (
                  <>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal & contact</h2>
                    <div className="space-y-4">
                      {[
                        { key: 'fullName', label: 'Full name', placeholder: 'John Doe' },
                        { key: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com' },
                        { key: 'phone', label: 'Phone', placeholder: '+255 ...' },
                        { key: 'address', label: 'Address', placeholder: 'Street, number' },
                        { key: 'city', label: 'City', placeholder: 'Dar es Salaam' },
                        { key: 'country', label: 'Country', placeholder: 'Tanzania' },
                        { key: 'linkedIn', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/...' },
                        { key: 'website', label: 'Website', placeholder: 'https://...' },
                      ].map(({ key, label, type = 'text', placeholder }) => (
                        <div key={key}>
                          <label className={labelClass}>{label}</label>
                          <input
                            type={type}
                            className={inputClass}
                            placeholder={placeholder}
                            value={data.personal[key as keyof typeof data.personal] ?? ''}
                            onChange={(e) => updatePersonal({ [key]: e.target.value })}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Professional summary</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">A short paragraph about your experience and goals.</p>
                    <textarea
                      className={`${inputClass} min-h-[160px] resize-y`}
                      placeholder="Experienced professional with..."
                      value={data.summary}
                      onChange={(e) => updateSummary(e.target.value)}
                      rows={6}
                    />
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Education</h2>
                      <button type="button" onClick={addEducation} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        + Add
                      </button>
                    </div>
                    {data.education.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">No entries yet. Add your education.</p>
                    ) : (
                      <div className="space-y-6">
                        {data.education.map((ed) => (
                          <div key={ed.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-600 space-y-3">
                            <div className="flex justify-end">
                              <button type="button" onClick={() => removeEducation(ed.id)} className="text-xs text-red-600 dark:text-red-400 hover:underline">
                                Remove
                              </button>
                            </div>
                            {[
                              { key: 'institution', label: 'Institution' },
                              { key: 'degree', label: 'Degree' },
                              { key: 'field', label: 'Field of study' },
                              { key: 'startDate', label: 'Start date' },
                              { key: 'endDate', label: 'End date' },
                            ].map(({ key, label }) => (
                              <div key={key}>
                                <label className={labelClass}>{label}</label>
                                <input
                                  className={inputClass}
                                  value={(ed as CVEducation)[key as keyof CVEducation] ?? ''}
                                  onChange={(e) => updateEducation(ed.id, { [key]: e.target.value })}
                                />
                              </div>
                            ))}
                            <div>
                              <label className={labelClass}>Description (optional)</label>
                              <textarea
                                className={`${inputClass} min-h-[80px] resize-y`}
                                value={ed.description}
                                onChange={(e) => updateEducation(ed.id, { description: e.target.value })}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Work experience</h2>
                      <button type="button" onClick={addExperience} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        + Add
                      </button>
                    </div>
                    {data.experience.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">No entries yet. Add your experience.</p>
                    ) : (
                      <div className="space-y-6">
                        {data.experience.map((ex) => (
                          <div key={ex.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-600 space-y-3">
                            <div className="flex justify-end">
                              <button type="button" onClick={() => removeExperience(ex.id)} className="text-xs text-red-600 dark:text-red-400 hover:underline">
                                Remove
                              </button>
                            </div>
                            {[
                              { key: 'company', label: 'Company' },
                              { key: 'role', label: 'Job title' },
                              { key: 'location', label: 'Location' },
                              { key: 'startDate', label: 'Start date' },
                              { key: 'endDate', label: 'End date' },
                            ].map(({ key, label }) => (
                              <div key={key}>
                                <label className={labelClass}>{label}</label>
                                <input
                                  className={inputClass}
                                  value={(ex as CVExperience)[key as keyof CVExperience] ?? ''}
                                  onChange={(e) => updateExperience(ex.id, { [key]: e.target.value })}
                                />
                              </div>
                            ))}
                            <div>
                              <label className={labelClass}>Description</label>
                              <textarea
                                className={`${inputClass} min-h-[100px] resize-y`}
                                value={ex.description}
                                onChange={(e) => updateExperience(ex.id, { description: e.target.value })}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {step === 4 && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Skills</h2>
                      <button type="button" onClick={addSkillGroup} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        + Add group
                      </button>
                    </div>
                    {data.skills.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Add a skill group (e.g. Technical, Languages).</p>
                    ) : (
                      <div className="space-y-6">
                        {data.skills.map((g) => (
                          <div key={g.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-600 space-y-3">
                            <div className="flex justify-between items-center">
                              <input
                                className={`${inputClass} max-w-[200px]`}
                                placeholder="Group name (e.g. Technical)"
                                value={g.name}
                                onChange={(e) => updateSkillGroup(g.id, { name: e.target.value })}
                              />
                              <button type="button" onClick={() => removeSkillGroup(g.id)} className="text-xs text-red-600 dark:text-red-400 hover:underline">
                                Remove
                              </button>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className={labelClass}>Skills (one per line)</label>
                                <button type="button" onClick={() => addSkillItem(g.id)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">+ Add skill</button>
                              </div>
                              {(g.items.length ? g.items : ['']).map((item, idx) => (
                                <div key={idx} className="flex gap-2 mb-2">
                                  <input
                                    className={inputClass}
                                    placeholder={idx === 0 ? 'e.g. JavaScript, React' : `Skill ${idx + 1}`}
                                    value={item}
                                    onChange={(e) => {
                                      if (g.items.length === 0) setSkills(data.skills.map((s) => (s.id === g.id ? { ...s, items: [e.target.value] } : s)));
                                      else updateSkillItem(g.id, idx, e.target.value);
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeSkillItem(g.id, idx)}
                                    className="shrink-0 px-2 text-red-600 dark:text-red-400 hover:underline"
                                    title="Remove"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {step === 5 && (
                  <>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Certifications</h2>
                    <div className="flex justify-end mb-2">
                      <button type="button" onClick={addCertification} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        + Add
                      </button>
                    </div>
                    <div className="space-y-4 mb-8">
                      {data.certifications.map((c) => (
                        <div key={c.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-600 flex flex-wrap gap-3">
                          <input className={`${inputClass} flex-1 min-w-[120px]`} placeholder="Name" value={c.name} onChange={(e) => updateCertification(c.id, { name: e.target.value })} />
                          <input className={`${inputClass} flex-1 min-w-[120px]`} placeholder="Issuer" value={c.issuer} onChange={(e) => updateCertification(c.id, { issuer: e.target.value })} />
                          <input className={`${inputClass} w-28`} placeholder="Date" value={c.date} onChange={(e) => updateCertification(c.id, { date: e.target.value })} />
                          <button type="button" onClick={() => removeCertification(c.id)} className="text-red-600 dark:text-red-400 text-sm">Remove</button>
                        </div>
                      ))}
                    </div>

                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Languages</h2>
                    <div className="flex justify-end mb-2">
                      <button type="button" onClick={addLanguage} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        + Add
                      </button>
                    </div>
                    <div className="space-y-3 mb-8">
                      {data.languages.map((l) => (
                        <div key={l.id} className="flex gap-2 items-center">
                          <input className={inputClass} placeholder="Language" value={l.language} onChange={(e) => updateLanguage(l.id, { language: e.target.value })} />
                          <input className={`${inputClass} w-32`} placeholder="Proficiency" value={l.proficiency} onChange={(e) => updateLanguage(l.id, { proficiency: e.target.value })} />
                          <button type="button" onClick={() => removeLanguage(l.id)} className="text-red-600 dark:text-red-400 text-sm">Remove</button>
                        </div>
                      ))}
                    </div>

                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">References</h2>
                    <div className="flex justify-end mb-2">
                      <button type="button" onClick={addReference} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        + Add
                      </button>
                    </div>
                    <div className="space-y-4">
                      {data.references.map((r) => (
                        <div key={r.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-600 space-y-2">
                          <div className="flex justify-end">
                            <button type="button" onClick={() => removeReference(r.id)} className="text-xs text-red-600 dark:text-red-400 hover:underline">Remove</button>
                          </div>
                          {[
                            { key: 'name', label: 'Name' },
                            { key: 'role', label: 'Role' },
                            { key: 'company', label: 'Company' },
                            { key: 'email', label: 'Email' },
                            { key: 'phone', label: 'Phone' },
                          ].map(({ key, label }) => (
                            <div key={key}>
                              <label className={labelClass}>{label}</label>
                              <input
                                className={inputClass}
                                type={key === 'email' ? 'email' : 'text'}
                                value={(r as CVReference)[key as keyof CVReference] ?? ''}
                                onChange={(e) => updateReference(r.id, { [key]: e.target.value })}
                              />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {step === 6 && (
                  <>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview & export</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Review your CV on the right. Use the button below to open the print dialog and save as PDF.
                    </p>
                    <button
                      type="button"
                      onClick={() => printCV(data)}
                      className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition"
                    >
                      Export as PDF
                    </button>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      In the print dialog, choose &quot;Save as PDF&quot; or &quot;Microsoft Print to PDF&quot; as the destination.
                    </p>
                  </>
                )}
              </div>

              {/* Step navigation */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                  disabled={step === STEPS.length - 1}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Right: live preview */}
            <div className="flex-1 min-w-0">
              <div className="sticky top-6">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Live preview</p>
                <div className="max-w-[210mm] mx-auto">
                  <CVPreview data={data} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
