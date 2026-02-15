'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

declare global {
  interface Window {
    mammoth?: {
      convertToHtml: (options: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }>;
    };
  }
}

type TabId = 'text-to-pdf' | 'docx-to-html';

export default function DocumentConvertingPage() {
  const [tab, setTab] = useState<TabId>('text-to-pdf');
  const [textContent, setTextContent] = useState('');
  const [isHtml, setIsHtml] = useState(false);
  const [docxFile, setDocxFile] = useState<File | null>(null);
  const [docxHtml, setDocxHtml] = useState<string | null>(null);
  const [docxError, setDocxError] = useState<string | null>(null);
  const [docxLoading, setDocxLoading] = useState(false);
  const [mammothReady, setMammothReady] = useState(false);

  useEffect(() => {
    if (tab !== 'docx-to-html') return;
    if (window.mammoth) {
      setMammothReady(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
    script.async = true;
    script.onload = () => setMammothReady(true);
    script.onerror = () => setMammothReady(false);
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, [tab]);

  const getPreviewHtml = useCallback(() => {
    if (tab === 'docx-to-html' && docxHtml) return docxHtml;
    const content = textContent.trim() || '<p class="text-gray-400 italic">Your content will appear here.</p>';
    if (isHtml) return content;
    return content
      .split(/\n\n+/)
      .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
      .join('');
  }, [tab, textContent, isHtml, docxHtml]);

  const handleExportPdf = useCallback(() => {
    const html = getPreviewHtml();
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Document</title>
  <style>
    body { font-family: system-ui, sans-serif; font-size: 12pt; line-height: 1.5; color: #111; max-width: 210mm; margin: 0 auto; padding: 20mm; }
    p { margin: 0 0 0.75em 0; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>${html}</body>
</html>`;
    const w = window.open('', '_blank', 'noopener,noreferrer');
    if (!w) {
      alert('Please allow pop-ups to export as PDF. Use the print dialog and choose "Save as PDF".');
      return;
    }
    w.document.write(fullHtml);
    w.document.close();
    w.focus();
    setTimeout(() => {
      w.print();
      w.close();
    }, 300);
  }, [getPreviewHtml]);

  const handleDownloadHtml = useCallback(() => {
    const html = getPreviewHtml();
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Document</title>
  <style>
    body { font-family: system-ui, sans-serif; font-size: 12pt; line-height: 1.5; color: #111; margin: 2em; }
    p { margin: 0 0 0.75em 0; }
  </style>
</head>
<body>${html}</body>
</html>`;
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [getPreviewHtml]);

  const handleDocxUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setDocxFile(file ?? null);
      setDocxHtml(null);
      setDocxError(null);
      e.target.value = '';
      if (!file) return;
      if (!file.name.toLowerCase().endsWith('.docx')) {
        setDocxError('Please select a .docx file.');
        return;
      }
      if (!window.mammoth) {
        setDocxError('Converter is still loading. Try again in a moment.');
        return;
      }
      setDocxLoading(true);
      try {
        const buf = await file.arrayBuffer();
        const { value } = await window.mammoth.convertToHtml({ arrayBuffer: buf });
        setDocxHtml(value);
      } catch (err) {
        setDocxError(err instanceof Error ? err.message : 'Conversion failed.');
      } finally {
        setDocxLoading(false);
      }
    },
    []
  );

  const inputClass =
    'w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              ← Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">Document Converting</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Convert text or HTML to PDF, or DOCX to HTML. All processing is done in your browser.
            </p>
          </div>

          <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setTab('text-to-pdf')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
                tab === 'text-to-pdf'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-gray-700 border-b-0 -mb-px'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Text / HTML → PDF
            </button>
            <button
              type="button"
              onClick={() => setTab('docx-to-html')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
                tab === 'docx-to-html'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-gray-700 border-b-0 -mb-px'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              DOCX → HTML
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {tab === 'text-to-pdf' && (
                <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Enter content</h2>
                  <label className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={isHtml}
                      onChange={(e) => setIsHtml(e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Treat as HTML</span>
                  </label>
                  <textarea
                    className={`${inputClass} min-h-[240px] font-mono text-sm resize-y`}
                    placeholder={isHtml ? 'Paste or type HTML…' : 'Paste or type plain text…'}
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    rows={12}
                  />
                </section>
              )}

              {tab === 'docx-to-html' && (
                <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload DOCX</h2>
                  {!mammothReady && <p className="text-sm text-amber-600 dark:text-amber-400 mb-2">Loading converter…</p>}
                  <label className="block">
                    <span className="sr-only">Choose .docx file</span>
                    <input
                      type="file"
                      accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-medium hover:file:bg-blue-700"
                      onChange={handleDocxUpload}
                      disabled={!mammothReady || docxLoading}
                    />
                  </label>
                  {docxLoading && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Converting…</p>}
                  {docxError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{docxError}</p>}
                  {docxFile && docxHtml && <p className="mt-2 text-sm text-green-600 dark:text-green-400">Converted. See preview and download below.</p>}
                </section>
              )}

              {(tab === 'text-to-pdf' && (textContent.trim() || true)) || (tab === 'docx-to-html' && docxHtml) ? (
                <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Export</h2>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleDownloadHtml}
                      className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition"
                    >
                      Download as HTML
                    </button>
                    <button
                      type="button"
                      onClick={handleExportPdf}
                      className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
                    >
                      Export as PDF
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    PDF opens the print dialog — choose &quot;Save as PDF&quot; as destination.
                  </p>
                </section>
              ) : null}
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Preview</h2>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 min-h-[320px]">
                <div
                  className="text-gray-900 dark:text-gray-100 text-sm leading-relaxed [&_p]:mb-2 [&_img]:max-w-full [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
                  dangerouslySetInnerHTML={{ __html: getPreviewHtml() }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}