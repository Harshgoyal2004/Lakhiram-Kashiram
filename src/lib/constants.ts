
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/products', label: 'Products' },
  { href: '/contact', label: 'Contact Us' },
];

export const SITE_NAME = "Lakhi Ram Kashi Ram Oils";
export const COMPANY_TAGLINE = "A Legacy of Purity & Trust";
export const COMPANY_FOUNDING_YEAR = "1923";

export const PRODUCT_CATEGORIES_INFO = [
  { slug: 'essential-spice-oil', name: 'Essential | Spice Oil', description: 'Explore our range of pure essential and spice oils.', dataAiHint: 'essential oils', imageUrl: 'https://media.istockphoto.com/id/1304141544/photo/essential-oils-with-rosemary-cloves-cinnamon.jpg?s=612x612&w=0&k=20&c=jQFlCPP5Jn--ZIky9yE2jZCAmdgboh4kIpPMSipWhto=' },
  { slug: 'carrier-oil', name: 'Range of Carrier Oil', description: 'Discover high-quality carrier oils for various applications.', dataAiHint: 'carrier oil collection', imageUrl: 'https://media.istockphoto.com/id/1250496678/photo/close-up-shot-of-fresh-cilantro-leaves-along-with-its-tea-oil-and-essential-oil-in-a.jpg?s=612x612&w=0&k=20&c=RT24_8-xcmF57-_vTXVJCDAidU02_fsJlbLbr2fRZkI=' },
  { slug: 'extract-soluble-oil', name: 'Extract | Soluble Oil', description: 'Find specialized extracts and soluble oils.', dataAiHint: 'oil extracts', imageUrl: 'https://static.vecteezy.com/system/resources/thumbnails/036/338/697/small/ai-generated-golden-skincare-oil-drops-with-air-bubbles-on-white-background-photo.jpg' },
  { slug: 'pg-water-extract', name: 'PG | Water Extract', description: 'Browse our selection of PG and water-based extracts.', dataAiHint: 'liquid extracts', imageUrl: 'https://media.istockphoto.com/id/1057883776/photo/oil-almond-cosmetic-medicine-health-nature-glass-vial-wooden-background.jpg?s=612x612&w=0&k=20&c=fhuHl8eCCwpozhUUw2rNo0dsza84f4dvx-knUAXdbjI=' },
  { slug: 'ayurvedic-oil', name: 'Ayurvedic Oil', description: 'Traditional Ayurvedic oils for wellness and care.', dataAiHint: 'ayurvedic products', imageUrl: 'https://media.istockphoto.com/id/1449866003/photo/concept-of-natural-essential-organic-oils-bali-spa-beauty-treatment-relax-time-atmosphere-of.jpg?s=612x612&w=0&k=20&c=jwp9eXFSMjeWvGRZfOszUuHR7Dl8OHSz4Xf42CaAT8w=' },
] as const; // Use "as const" for better type inference on slugs and names

export type ProductCategorySlug = typeof PRODUCT_CATEGORIES_INFO[number]['slug'];
export type ProductCategoryName = typeof PRODUCT_CATEGORIES_INFO[number]['name'];
// Add imageUrl to the type if you want type safety for it, though "as const" helps.
// For explicit typing:
export interface ProductCategoryInfo {
  slug: ProductCategorySlug;
  name: ProductCategoryName;
  description: string;
  dataAiHint: string;
  imageUrl?: string;
}
