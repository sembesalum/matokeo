'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { IMAGE_FORMATS, type ImageFormatOption } from '@/lib/imageFormatPresets';

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

function imageToBlob(
  img: HTMLImageElement,
  format: ImageFormatOption,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas not supported'));
      return;
    }
    ctx.drawImage(img, 0, 0);
    const mime = format.mime;
    const q = mime === 'image/png' ? undefined : quality;
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Export failed'))),
      mime,
      q
    );
  });
}

export default function ImagesExtensionChangerPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [formatId, setFormatId] = useState<string>(IMAGE_FORMATS[0].id);
  const [quality, setQuality] = useState(0.92);
  const [error, setError] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const previewUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    previewUrlsRef.current.forEach(URL.revokeObjectURL);
    const urls = files.map((f) => URL.createObjectURL(f));
    previewUrlsRef.current = urls;
    setPreviewUrls(urls);
    return () => {
      previewUrlsRef.current.forEach(URL.revokeObjectURL);
      previewUrlsRef.current = [];
    };
  }, [files]);

  const format = IMAGE_FORMATS.find((f) => f.id === formatId) ?? IMAGE_FORMATS[0];
  const showQuality = format.mime === 'image/jpeg' || format.mime === 'image/webp';

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    setError(null);
    const valid = selected.filter((f) => f.type.startsWith('image/'));
    if (valid.length < selected.length) setError('Some files were not images and were skipped.');
    setFiles((prev) => (valid.length ? [...prev, ...valid] : prev));
    e.target.value = '';
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearAll = useCallback(() => {
    setFiles([]);
    setError(null);
  }, []);

  const downloadBlob = useCallback((blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const convertOne = useCallback(
    async (file: File, index: number) => {
      setConverting(true);
      setError(null);
      try {
        const img = await loadImage(file);
        const blob = await imageToBlob(img, format, quality);
        const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
        const ext = format.extension;
        downloadBlob(blob, `${baseName}.${ext}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Conversion failed');
      } finally {
        setConverting(false);
      }
    },
    [format, quality, downloadBlob]
  );

  const convertAll = useCallback(async () => {
    setConverting(true);
    setError(null);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const img = await loadImage(file);
        const blob = await imageToBlob(img, format, quality);
        const baseName = file.name.replace(/\.[^.]+$/, '') || `image-${i + 1}`;
        downloadBlob(blob, `${baseName}.${format.extension}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setConverting(false);
    }
  }, [files, format, quality, downloadBlob]);

  const inputClass =
    'w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              ← Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">Images Extension Changer</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Upload images and convert them to JPEG, PNG, or WebP. All processing is done in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload images</h2>
                <label className="block">
                  <span className="sr-only">Choose images</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-medium hover:file:bg-blue-700"
                    onChange={handleFileChange}
                  />
                </label>
                {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
              </section>

              <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Output format</h2>
                <label className={labelClass}>Convert to</label>
                <select className={inputClass} value={formatId} onChange={(e) => setFormatId(e.target.value)}>
                  {IMAGE_FORMATS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} (.{f.extension}){f.description ? ` — ${f.description}` : ''}
                    </option>
                  ))}
                </select>
                {showQuality && (
                  <div className="mt-4">
                    <label className={labelClass}>Quality: {Math.round(quality * 100)}%</label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.01"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none bg-gray-200 dark:bg-gray-700 accent-blue-600"
                    />
                  </div>
                )}
              </section>

              {files.length > 0 && (
                <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Convert & download</h2>
                    <button
                      type="button"
                      onClick={clearAll}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                      Clear all
                    </button>
                  </div>
                  <button
                    type="button"
                    disabled={converting}
                    onClick={convertAll}
                    className="w-full mb-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition"
                  >
                    {converting ? 'Converting…' : `Download all as .${format.extension}`}
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Or convert one by one:</p>
                  <ul className="space-y-2 max-h-64 overflow-y-auto">
                    {files.map((file, i) => (
                      <li key={`${file.name}-${i}`} className="flex items-center justify-between gap-2 py-2 border-b border-gray-200 dark:border-gray-600 last:border-0">
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1" title={file.name}>
                          {file.name}
                        </span>
                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            disabled={converting}
                            onClick={() => convertOne(file, i)}
                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
                          >
                            Download
                          </button>
                          <button type="button" onClick={() => removeFile(i)} className="text-sm text-red-600 dark:text-red-400 hover:underline">
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Uploaded images ({files.length})</h2>
              {files.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {files.map((file, i) => (
                    <div key={`${file.name}-${i}`} className="relative aspect-square rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={previewUrls[i] ?? ''}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                        {file.name}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 border-dashed p-8 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">No images yet. Upload one or more to convert.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}