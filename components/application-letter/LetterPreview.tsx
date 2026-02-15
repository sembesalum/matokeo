'use client';

import type { ApplicationLetterData, RecipientBlock } from '@/lib/applicationLetterTypes';

interface LetterPreviewProps {
  data: ApplicationLetterData;
  className?: string;
}

function formatDate(s: string): string {
  if (!s || !s.trim()) return '';
  try {
    const d = new Date(s);
    if (isNaN(d.getTime())) return s;
    const day = d.getDate();
    const suffix = day === 1 || day === 21 || day === 31 ? 'ST' : day === 2 || day === 22 ? 'ND' : day === 3 || day === 23 ? 'RD' : 'TH';
    const months = 'JANUARY,FEBRUARY,MARCH,APRIL,MAY,JUNE,JULY,AUGUST,SEPTEMBER,OCTOBER,NOVEMBER,DECEMBER'.split(',');
    return `${day}${suffix} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return s;
  }
}

function recipientBlock(r: RecipientBlock) {
  const has = r.title || r.companyName || r.address;
  if (!has) return null;
  return (
    <div className="text-sm text-gray-700">
      {r.title && <p className="font-medium text-gray-900 uppercase">{r.title}</p>}
      {r.companyName && <p className="font-medium text-gray-900 uppercase">{r.companyName}</p>}
      {r.address && <p className="whitespace-pre-line">{r.address}</p>}
    </div>
  );
}

function block(text: string) {
  if (!text.trim()) return null;
  return <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-4">{text}</p>;
}

export default function LetterPreview({ data, className = '' }: LetterPreviewProps) {
  const {
    date,
    applicant,
    recipient,
    recipient2,
    salutation,
    referenceLine,
    bodyParagraph1,
    bodyParagraph2,
    bodyParagraph3,
    closingLine,
    closing,
    signatureName,
  } = data;

  const hasRecipient = recipient.title || recipient.companyName || recipient.address;
  const hasRecipient2 = recipient2 && (recipient2.title || recipient2.companyName || recipient2.address);
  const hasBody = bodyParagraph1 || bodyParagraph2 || bodyParagraph3;

  const cityCountry = [applicant.city, applicant.country].filter(Boolean).join(', ');

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 p-6 md:p-8 text-gray-900 max-w-[210mm] ${className}`}>
      {/* First: your details (right-aligned), then below: recipient(s) (left) */}
      <div className="text-right mb-6">
        {applicant.name && <p className="text-sm text-gray-700">{applicant.name}</p>}
        {applicant.institution && <p className="text-sm text-gray-700">{applicant.institution}</p>}
        {applicant.address && <p className="text-sm text-gray-700">{applicant.address}</p>}
        {cityCountry && <p className="text-sm text-gray-700">{cityCountry}</p>}
        {applicant.email && <p className="text-sm text-gray-700">{applicant.email}</p>}
        {applicant.phone && <p className="text-sm text-gray-700">{applicant.phone}</p>}
        {date && <p className="text-sm font-medium text-gray-900 mt-2">{formatDate(date)}</p>}
      </div>
      {(hasRecipient || hasRecipient2) && (
        <div className="text-left mb-6">
          {hasRecipient && <div className="mb-4">{recipientBlock(recipient)}</div>}
          {hasRecipient2 && recipient2 && <div>{recipientBlock(recipient2)}</div>}
        </div>
      )}

      {salutation && <p className="text-sm mb-4">{salutation}</p>}

      {referenceLine && (
        <p className="text-sm font-medium text-center my-4 uppercase">{referenceLine}</p>
      )}

      {hasBody && (
        <div className="space-y-4 mb-6">
          {block(bodyParagraph1)}
          {block(bodyParagraph2)}
          {block(bodyParagraph3)}
        </div>
      )}

      {!hasBody && <p className="text-sm text-gray-500 italic mb-6">Your letter body will appear here.</p>}

      {closingLine && <p className="text-sm text-gray-700 mb-2">{closingLine}</p>}
      {closing && <p className="text-sm mb-2">{closing}</p>}
      {signatureName && <p className="font-semibold text-gray-900 uppercase">{signatureName}</p>}
    </div>
  );
}
