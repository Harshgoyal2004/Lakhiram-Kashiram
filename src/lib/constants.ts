
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/products', label: 'Products' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact Us' },
];

export const SITE_NAME = "Lakhi Ram Kashi Ram Oils";
export const COMPANY_TAGLINE = "A Legacy of Purity & Trust";
export const COMPANY_FOUNDING_YEAR = "1923";

export const PRODUCT_CATEGORIES_INFO = [
  { slug: 'essential-spice-oil', name: 'Essential | Spice Oil', description: 'Explore our range of pure essential and spice oils.', dataAiHint: 'essential oils' },
  { slug: 'carrier-oil', name: 'Range of Carrier Oil', description: 'Discover high-quality carrier oils for various applications.', dataAiHint: 'carrier oil collection' },
  { slug: 'extract-soluble-oil', name: 'Extract | Soluble Oil', description: 'Find specialized extracts and soluble oils.', dataAiHint: 'oil extracts' },
  { slug: 'pg-water-extract', name: 'PG | Water Extract', description: 'Browse our selection of PG and water-based extracts.', dataAiHint: 'liquid extracts' },
  { slug: 'ayurvedic-oil', name: 'Ayurvedic Oil', description: 'Traditional Ayurvedic oils for wellness and care.', dataAiHint: 'ayurvedic products' },
] as const; // Use "as const" for better type inference on slugs and names

export type ProductCategorySlug = typeof PRODUCT_CATEGORIES_INFO[number]['slug'];
export type ProductCategoryName = typeof PRODUCT_CATEGORIES_INFO[number]['name'];
