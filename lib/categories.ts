/**
 * Stationary Kiganjani – tool categories.
 * Only "Results Calculations Tools" (Matokeo) is live; others are dummy/coming soon.
 */
export interface CategoryItem {
  id: string;
  title: string;
  description: string;
  href: string;
  /** Used for dummy tool pages (slug in URL) */
  slug?: string;
  /** Matokeo = real app; others are placeholder */
  isLive: boolean;
  icon: string;
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'results-calculations',
    title: 'Results Calculations Tools',
    description: 'Manage class results, grades, and student performance (Matokeo).',
    href: '/dashboard',
    isLive: true,
    icon: 'calculator',
  },
  {
    id: 'cv-builder',
    title: 'CV Builder',
    description: 'Create and format professional CVs.',
    href: '/tools/cv-builder',
    slug: 'cv-builder',
    isLive: true,
    icon: 'document',
  },
  {
    id: 'applications-letters',
    title: 'Applications Letters',
    description: 'Templates and tools for application letters.',
    href: '/tools/applications-letters',
    slug: 'applications-letters',
    isLive: true,
    icon: 'mail',
  },
  {
    id: 'helsb-loan-letters',
    title: 'Helsb Loan Letters',
    description: 'Generate HELSB loan application letters.',
    href: '/tools/helsb-loan-letters',
    slug: 'helsb-loan-letters',
    isLive: false,
    icon: 'bank',
  },
  {
    id: 'passport-photo-resize',
    title: 'Passport Photo Resize',
    description: 'Resize photos to passport specifications.',
    href: '/tools/passport-photo-resize',
    slug: 'passport-photo-resize',
    isLive: true,
    icon: 'camera',
  },
  {
    id: 'images-extension-changer',
    title: 'Images Extension Changer',
    description: 'Convert image formats (e.g. JPG, PNG, WebP).',
    href: '/tools/images-extension-changer',
    slug: 'images-extension-changer',
    isLive: true,
    icon: 'photo',
  },
  {
    id: 'university-assignment-cover',
    title: 'University Assignment Cover Pages',
    description: 'Standard cover page templates for assignments.',
    href: '/tools/university-assignment-cover-pages',
    slug: 'university-assignment-cover-pages',
    isLive: false,
    icon: 'academic',
  },
  {
    id: 'certificate-attendance',
    title: 'Simple Certificate Attendance',
    description: 'Create simple attendance certificates.',
    href: '/tools/simple-certificate-attendance',
    slug: 'simple-certificate-attendance',
    isLive: false,
    icon: 'certificate',
  },
  {
    id: 'document-converting',
    title: 'Document Converting',
    description: 'Convert between document formats (PDF, DOC, etc.).',
    href: '/tools/document-converting',
    slug: 'document-converting',
    isLive: true,
    icon: 'convert',
  },
  {
    id: 'timetable-builders',
    title: 'Timetable Builders',
    description: 'Build and manage timetables.',
    href: '/tools/timetable-builders',
    slug: 'timetable-builders',
    isLive: true,
    icon: 'calendar',
  },
  {
    id: 'government-links',
    title: 'Government Links',
    description: 'Quick links to government portals and services.',
    href: '/tools/government-links',
    slug: 'government-links',
    isLive: false,
    icon: 'link',
  },
  {
    id: 'results-links',
    title: 'Results Links',
    description: 'Links to official results and examination bodies.',
    href: '/tools/results-links',
    slug: 'results-links',
    isLive: false,
    icon: 'chart',
  },
  {
    id: 'university-websites',
    title: 'University Websites',
    description: 'Direct links to university websites.',
    href: '/tools/university-websites',
    slug: 'university-websites',
    isLive: false,
    icon: 'building',
  },
  {
    id: 'schools-websites',
    title: 'Schools Websites',
    description: 'Direct links to schools and education portals.',
    href: '/tools/schools-websites',
    slug: 'schools-websites',
    isLive: false,
    icon: 'school',
  },
];

export function getCategoryBySlug(slug: string): CategoryItem | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
