'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PASSPORT_PRESETS, type PassportPreset } from '@/lib/passportPhotoPresets';

/** Draw image on canvas with center-crop to exact width x height. */
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number
): void {
  const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
  const srcW = targetWidth / scale;
  const srcH = targetHeight / scale;
  const sx = (img.width - srcW) / 2;
  const sy = (img.height - srcH) / 2;
  ctx.drawImage(img, sx, sy, srcW, srcH, 0, 0, targetWidth, targetHeight);
}

/** Resize/crop image to preset dimensions; returns data URL. */
function getResizedDataUrl(
  img: HTMLImageElement,
  preset: PassportPreset
): string {
  const canvas = document.createElement('canvas');
  canvas.width = preset.width;
  canvas.height = preset.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  drawImageCover(ctx, img, preset.width, preset.height);
  return canvas.toDataURL('image/png');
}

/** Create a sheet of N copies (e.g. 4 = 2x2 grid). */
function getSheetDataUrl(
  img: HTMLImageElement,
  preset: PassportPreset,
  copies: 4 | 6
): string {
  const gap = 20;
  const cols = copies === 4 ? 2 : 2;
  const rows = copies === 4 ? 2 : 3;
  const sheetW = cols * preset.width + (cols + 1) * gap;
  const sheetH = rows * preset.height + (rows + 1) * gap;
  const canvas = document.createElement('canvas');
  canvas.width = sheetW;
  canvas.height = sheetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, sheetW, sheetH);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = gap + col * (preset.width + gap);
      const y = gap + row * (preset.height + gap);
      ctx.save();
      ctx.translate(x, y);
      drawImageCover(ctx, img, preset.width, preset.height);
      ctx.restore();
    }
  }
  return canvas.toDataURL('image/png');
}

export default function PassportPhotoResizePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);
  const [presetId, setPresetId] = useState<string>(PASSPORT_PRESETS[0].id);
  const [error, setError] = useState<string | null>(null);

  const preset = PASSPORT_PRESETS.find((p) => p.id === presetId) ?? PASSPORT_PRESETS[0];

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setError(null);
    setLoadedImg(null);
    if (!f) {
      setFile(null);
      return;
    }
    if (!f.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, etc.).');
      return;
    }
    setFile(f);
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setLoadedImg(img);
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      setError('Failed to load image.');
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, []);

  const processedUrl = loadedImg && preset ? getResizedDataUrl(loadedImg, preset) : null;

  const handleDownloadSingle = useCallback(() => {
    if (!processedUrl) return;
    const a = document.createElement('a');
    a.href = processedUrl;
    a.download = `passport-${preset.id}-${Date.now()}.png`;
    a.click();
  }, [processedUrl, preset.id]);

  const handleDownloadSheet = useCallback((copies: 4 | 6) => {
    if (!loadedImg) return;
    const url = getSheetDataUrl(loadedImg, preset, copies);
    const a = document.createElement('a');
    a.href = url;
    a.download = `passport-sheet-${copies}-${Date.now()}.png`;
    a.click();
  }, [preset, loadedImg]);

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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">Passport Photo Resize</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Upload a photo and resize it to standard passport dimensions. Download as single image or a sheet for printing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload photo</h2>
                <label className="block">
                  <span className="sr-only">Choose image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-medium hover:file:bg-blue-700"
                    onChange={handleFileChange}
                  />
                </label>
                {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
              </section>

              <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Size preset</h2>
                <label className={labelClass}>Select passport size</label>
                <select
                  className={inputClass}
                  value={presetId}
                  onChange={(e) => setPresetId(e.target.value)}
                >
                  {PASSPORT_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.description}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Output: {preset.width} × {preset.height} px (300 DPI equivalent for {preset.mm ?? preset.name})
                </p>
              </section>

              {file && (
                <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Download</h2>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handleDownloadSingle}
                      className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
                    >
                      Download single photo
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadSheet(4)}
                      className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition"
                    >
                      Download sheet (4 photos)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadSheet(6)}
                      className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition"
                    >
                      Download sheet (6 photos)
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Downloads are PNG images.
                  </p>
                </section>
              )}
            </div>

            <div className="lg:sticky lg:top-6">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Preview</h2>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 flex flex-col items-center justify-center min-h-[280px]">
                {processedUrl ? (
                  <>
                    <img
                      src={processedUrl}
                      alt="Passport preview"
                      className="max-w-full border border-gray-200 dark:border-gray-600 rounded"
                      style={{ maxHeight: '320px' }}
                    />
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {preset.width} × {preset.height} px
                    </p>
                  </>
                ) : file && !loadedImg ? (
                  <p className="text-sm text-amber-600 dark:text-amber-400">Loading preview…</p>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Upload a photo to see the resized preview.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}