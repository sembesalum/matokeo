'use client';

import type { ApplicationLetterData, RecipientBlock } from '@/lib/applicationLetterTypes';

const esc = (s: string) =>
  String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

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

function line(s: string): string {
  return s ? esc(s) + '<br>' : '';
}

function recipientHtml(r: RecipientBlock): string {
  const parts: string[] = [];
  if (r.title) parts.push(`<p style="margin:0 0 2px 0; font-weight:600; text-transform:uppercase;">${esc(r.title)}</p>`);
  if (r.companyName) parts.push(`<p style="margin:0 0 2px 0; font-weight:600; text-transform:uppercase;">${esc(r.companyName)}</p>`);
  if (r.address) parts.push(`<p style="margin:0; white-space:pre-line;">${esc(r.address).replace(/\n/g, '<br>')}</p>`);
  return parts.length ? parts.join('') : '';
}

export function getLetterPrintHtml(data: ApplicationLetterData): string {
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

  const senderParts: string[] = [];
  if (applicant.name) senderParts.push(`<p style="margin:0 0 2px 0;">${esc(applicant.name)}</p>`);
  if (applicant.institution) senderParts.push(`<p style="margin:0 0 2px 0;">${esc(applicant.institution)}</p>`);
  if (applicant.address) senderParts.push(`<p style="margin:0 0 2px 0;">${esc(applicant.address)}</p>`);
  const cityCountry = [applicant.city, applicant.country].filter(Boolean).join(', ');
  if (cityCountry) senderParts.push(`<p style="margin:0 0 2px 0;">${esc(cityCountry)}</p>`);
  if (applicant.email) senderParts.push(`<p style="margin:0 0 2px 0;">${esc(applicant.email)}</p>`);
  if (applicant.phone) senderParts.push(`<p style="margin:0 0 2px 0;">${esc(applicant.phone)}</p>`);
  if (date) senderParts.push(`<p style="margin:8px 0 0 0; font-weight:600;">${esc(formatDate(date))}</p>`);
  const senderHtml = senderParts.join('');

  const recipient1Html = recipientHtml(recipient);
  const recipient2Html = recipient2 ? recipientHtml(recipient2) : '';
  const recipientBlockHtml = recipient1Html + (recipient2Html ? '<div style="margin-top:12px;">' + recipient2Html + '</div>' : '');

  const bodyParagraphs = [bodyParagraph1, bodyParagraph2, bodyParagraph3].filter(Boolean);
  const bodyHtml = bodyParagraphs.map((p) => `<p style="margin:0 0 1em 0; white-space:pre-line;">${esc(p).replace(/\n/g, '<br>')}</p>`).join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Application Letter</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; font-size: 11pt; line-height: 1.5; color: #111; max-width: 210mm; margin: 0 auto; padding: 15mm; }
    .sender { text-align: right; margin-bottom: 24px; }
    .sender p { margin: 0 0 2px 0; }
    .recipient { text-align: left; margin-bottom: 24px; }
    .recipient p { margin: 0 0 2px 0; }
    .ref-center { text-align: center; font-weight: 600; text-transform: uppercase; margin: 16px 0; }
    .salutation { margin-bottom: 12px; }
    .body p { margin: 0 0 1em 0; }
    .closing-line { margin-top: 16px; margin-bottom: 4px; }
    .closing { margin-bottom: 4px; }
    .signature { font-weight: 600; text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="sender">${senderHtml}</div>
  ${recipientBlockHtml ? `<div class="recipient">${recipientBlockHtml}</div>` : ''}
  ${salutation ? `<div class="salutation">${esc(salutation)}</div>` : ''}
  ${referenceLine ? `<div class="ref-center">${esc(referenceLine)}</div>` : ''}
  <div class="body">${bodyHtml || ''}</div>
  ${closingLine ? `<div class="closing-line">${esc(closingLine)}</div>` : ''}
  ${closing ? `<div class="closing">${esc(closing)}</div>` : ''}
  ${signatureName ? `<div class="signature">${esc(signatureName)}</div>` : ''}
</body>
</html>`;
}

export function printLetter(data: ApplicationLetterData): void {
  const html = getLetterPrintHtml(data);
  const w = window.open('', '_blank', 'noopener,noreferrer');
  if (!w) {
    alert('Please allow pop-ups to export your letter as PDF. You can also use your browser\'s Print (Ctrl+P) and choose "Save as PDF".');
    return;
  }
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => {
    w.print();
    w.close();
  }, 300);
}
