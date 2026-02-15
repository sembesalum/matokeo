export interface ImageFormatOption {
  id: string;
  name: string;
  mime: string;
  extension: string;
  description?: string;
  /** 0–1 for formats that support quality (e.g. JPEG, WebP) */
  defaultQuality?: number;
}

export const IMAGE_FORMATS: ImageFormatOption[] = [
  { id: 'jpeg', name: 'JPEG', mime: 'image/jpeg', extension: 'jpg', description: 'Good for photos', defaultQuality: 0.92 },
  { id: 'png', name: 'PNG', mime: 'image/png', extension: 'png', description: 'Lossless, supports transparency' },
  { id: 'webp', name: 'WebP', mime: 'image/webp', extension: 'webp', description: 'Modern format, smaller size', defaultQuality: 0.9 },
];

export function getFormatById(id: string): ImageFormatOption | undefined {
  return IMAGE_FORMATS.find((f) => f.id === id);
}
