'use client';

import type { CVData } from '@/lib/cvTypes';

export function getCVPrintHtml(data: CVData): string {
  const { personal, summary, education, experience, skills, certifications, languages, references } = data;
  const esc = (s: string) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const contact = [personal.email, personal.phone, [personal.address, personal.city, personal.country].filter(Boolean).join(', '), personal.linkedIn, personal.website].filter(Boolean).join(' • ');

  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>CV - ${esc(personal.fullName) || 'CV'}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; font-size: 11pt; line-height: 1.4; color: #111; max-width: 210mm; margin: 0 auto; padding: 12mm; }
    h1 { font-size: 22pt; margin: 0 0 6pt 0; }
    .contact { font-size: 10pt; color: #444; margin-bottom: 14pt; }
    .section { margin-bottom: 12pt; }
    .section-title { font-size: 11pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #333; margin-bottom: 6pt; padding-bottom: 2pt; }
    .item { margin-bottom: 8pt; }
    .item h3 { font-size: 11pt; font-weight: 700; margin: 0 0 2pt 0; }
    .item .meta { font-size: 10pt; color: #555; margin-bottom: 2pt; }
    .item p { margin: 0; white-space: pre-line; }
    ul { margin: 2pt 0; padding-left: 18pt; }
  </style>
</head>
<body>
  <h1>${esc(personal.fullName) || 'Your Name'}</h1>
  <div class="contact">${esc(contact)}</div>
`;

  if (summary) {
    html += `  <div class="section"><div class="section-title">Professional Summary</div><p>${esc(summary).replace(/\n/g, '<br>')}</p></div>\n`;
  }

  if (education.length > 0) {
    html += '  <div class="section"><div class="section-title">Education</div>\n';
    education.forEach((ed) => {
      html += `    <div class="item"><h3>${esc(ed.degree)}${ed.field ? ` in ${esc(ed.field)}` : ''}</h3><div class="meta">${esc(ed.institution)} | ${esc(ed.startDate)} – ${esc(ed.endDate) || 'Present'}</div>${ed.description ? `<p>${esc(ed.description).replace(/\n/g, '<br>')}</p>` : ''}</div>\n`;
    });
    html += '  </div>\n';
  }

  if (experience.length > 0) {
    html += '  <div class="section"><div class="section-title">Work Experience</div>\n';
    experience.forEach((ex) => {
      html += `    <div class="item"><h3>${esc(ex.role)}</h3><div class="meta">${esc(ex.company)}${ex.location ? `, ${esc(ex.location)}` : ''} | ${esc(ex.startDate)} – ${esc(ex.endDate) || 'Present'}</div>${ex.description ? `<p>${esc(ex.description).replace(/\n/g, '<br>')}</p>` : ''}</div>\n`;
    });
    html += '  </div>\n';
  }

  const skillsWithContent = skills.filter((g) => g.name || g.items.length);
  if (skillsWithContent.length > 0) {
    html += '  <div class="section"><div class="section-title">Skills</div>\n';
    skillsWithContent.forEach((g) => {
      html += `    <div class="item">${g.name ? `<h3>${esc(g.name)}</h3>` : ''}<p>${esc(g.items.filter(Boolean).join(', '))}</p></div>\n`;
    });
    html += '  </div>\n';
  }

  const certsWithContent = certifications.filter((c) => c.name || c.issuer);
  if (certsWithContent.length > 0) {
    html += '  <div class="section"><div class="section-title">Certifications</div>\n';
    certsWithContent.forEach((c) => {
      html += `    <div class="item"><strong>${esc(c.name)}</strong>${c.issuer ? ` – ${esc(c.issuer)}` : ''}${c.date ? ` (${esc(c.date)})` : ''}</div>\n`;
    });
    html += '  </div>\n';
  }

  const langsWithContent = languages.filter((l) => l.language);
  if (langsWithContent.length > 0) {
    html += '  <div class="section"><div class="section-title">Languages</div><p>' + langsWithContent.map((l) => `${esc(l.language)}${l.proficiency ? ` (${esc(l.proficiency)})` : ''}`).join(', ') + '</p></div>\n';
  }

  const refsWithContent = references.filter((r) => r.name || r.role);
  if (refsWithContent.length > 0) {
    html += '  <div class="section"><div class="section-title">References</div>\n';
    refsWithContent.forEach((r) => {
      html += `    <div class="item"><strong>${esc(r.name)}</strong> – ${esc(r.role)}${r.company ? `, ${esc(r.company)}` : ''}${r.email ? `<br>${esc(r.email)}` : ''}</div>\n`;
    });
    html += '  </div>\n';
  }

  html += '</body></html>';
  return html;
}

export function printCV(data: CVData): void {
  const html = getCVPrintHtml(data);
  const w = window.open('', '_blank', 'noopener,noreferrer');
  if (!w) {
    alert('Please allow pop-ups to export your CV as PDF. You can also use your browser\'s Print (Ctrl+P) and choose "Save as PDF".');
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
