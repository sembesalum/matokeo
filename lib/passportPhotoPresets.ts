/** Passport photo size presets (width x height in pixels at 300 DPI for print). */
export interface PassportPreset {
  id: string;
  name: string;
  description: string;
  width: number;
  height: number;
  mm?: string;
}

export const PASSPORT_PRESETS: PassportPreset[] = [
  { id: '35x45', name: '35 × 45 mm', description: 'Most countries (UK, EU, Tanzania, etc.)', width: 413, height: 531, mm: '35×45 mm' },
  { id: '35x50', name: '35 × 50 mm', description: 'Some visas and IDs', width: 413, height: 591, mm: '35×50 mm' },
  { id: '2x2', name: '2 × 2 inch (51×51 mm)', description: 'US, India, and others', width: 600, height: 600, mm: '51×51 mm' },
  { id: '50x50', name: '50 × 50 mm', description: 'Square format', width: 591, height: 591, mm: '50×50 mm' },
];

export function getPresetById(id: string): PassportPreset | undefined {
  return PASSPORT_PRESETS.find((p) => p.id === id);
}
