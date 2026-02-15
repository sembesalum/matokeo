'use client';

import type { CVData } from '@/lib/cvTypes';

interface CVPreviewProps {
  data: CVData;
  className?: string;
  forPrint?: boolean;
}

export default function CVPreview({ data, className = '', forPrint = false }: CVPreviewProps) {
  const { personal, summary, education, experience, skills, certifications, languages, references } = data;
  const rootClass = forPrint ? 'cv-print bg-white text-black p-10 text-sm' : 'bg-white rounded-lg shadow-lg p-6 md:p-8 text-gray-900 border border-gray-200';

  const line = (label: string, value: string) =>
    value ? (
      <span>
        {label}: {value}
      </span>
    ) : null;

  const contactParts = [
    personal.email,
    personal.phone,
    [personal.address, personal.city, personal.country].filter(Boolean).join(', '),
    personal.linkedIn,
    personal.website,
  ].filter(Boolean);

  return (
    <div className={`${rootClass} ${className}`} id="cv-preview-root">
      <style>{`
        .cv-print { max-width: 210mm; margin: 0 auto; font-family: system-ui, sans-serif; }
        .cv-print .section-title { font-size: 11pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #333; margin-top: 14pt; margin-bottom: 6pt; padding-bottom: 2pt; }
        .cv-print h1 { font-size: 18pt; margin: 0 0 4pt 0; }
        .cv-print .contact { font-size: 9pt; color: #444; margin-bottom: 10pt; }
        .cv-print .summary { margin-bottom: 10pt; line-height: 1.4; }
        .cv-print ul { margin: 2pt 0; padding-left: 18pt; }
        .cv-print .block { margin-bottom: 10pt; }
        .cv-print .block h3 { font-size: 10pt; font-weight: 700; margin: 0 0 2pt 0; }
        .cv-print .block .meta { font-size: 9pt; color: #555; margin-bottom: 2pt; }
      `}</style>

      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{personal.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-0 text-sm text-gray-600">
          {contactParts.map((part, i) => (
            <span key={i}>{part}</span>
          ))}
        </div>
      </header>

      {summary && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-300 pb-1 mb-2">Professional Summary</h2>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{summary}</p>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-300 pb-1 mb-2">Education</h2>
          {education.map((ed) => (
            <div key={ed.id} className="mb-4">
              <h3 className="font-semibold text-gray-900">{ed.degree} {ed.field && `in ${ed.field}`}</h3>
              <p className="text-sm text-gray-600">{ed.institution}</p>
              <p className="text-xs text-gray-500">{(ed.startDate || ed.endDate) && `${ed.startDate || '…'} – ${ed.endDate || 'Present'}`}</p>
              {ed.description && <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{ed.description}</p>}
            </div>
          ))}
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-300 pb-1 mb-2">Work Experience</h2>
          {experience.map((ex) => (
            <div key={ex.id} className="mb-4">
              <h3 className="font-semibold text-gray-900">{ex.role}</h3>
              <p className="text-sm text-gray-600">{ex.company}{ex.location ? `, ${ex.location}` : ''}</p>
              <p className="text-xs text-gray-500">{(ex.startDate || ex.endDate) && `${ex.startDate || '…'} – ${ex.endDate || 'Present'}`}</p>
              {ex.description && <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{ex.description}</p>}
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && skills.some((g) => g.name || g.items.some(Boolean)) && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-300 pb-1 mb-2">Skills</h2>
          {skills.map((g) =>
            g.name || g.items.some(Boolean) ? (
              <div key={g.id} className="mb-3">
                {g.name && <h3 className="text-sm font-medium text-gray-800">{g.name}</h3>}
                <p className="text-sm text-gray-700">{g.items.filter(Boolean).join(', ')}</p>
              </div>
            ) : null
          )}
        </section>
      )}

      {certifications.length > 0 && certifications.some((c) => c.name || c.issuer) && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-300 pb-1 mb-2">Certifications</h2>
          {certifications.map((c) =>
            c.name || c.issuer ? (
              <div key={c.id} className="mb-2">
                <span className="font-medium text-gray-900">{c.name}</span>
                {c.issuer && <span className="text-gray-600"> – {c.issuer}</span>}
                {c.date && <span className="text-gray-500 text-xs"> ({c.date})</span>}
              </div>
            ) : null
          )}
        </section>
      )}

      {languages.length > 0 && languages.some((l) => l.language) && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-300 pb-1 mb-2">Languages</h2>
          <p className="text-sm text-gray-700">
            {languages
              .filter((l) => l.language)
              .map((l) => (l.proficiency ? `${l.language} (${l.proficiency})` : l.language))
              .join(', ')}
          </p>
        </section>
      )}

      {references.length > 0 && references.some((r) => r.name || r.role) && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-300 pb-1 mb-2">References</h2>
          {references.map((r) =>
            r.name || r.role ? (
              <div key={r.id} className="mb-2 text-sm">
                <span className="font-medium text-gray-900">{r.name}</span>
                {(r.role || r.company) && <span className="text-gray-600"> – {[r.role, r.company].filter(Boolean).join(', ')}</span>}
                {r.email && <span className="block text-gray-500 text-xs">{r.email}</span>}
              </div>
            ) : null
          )}
        </section>
      )}
    </div>
  );
}
