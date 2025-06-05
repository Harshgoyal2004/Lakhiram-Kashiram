
import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/products';
import { NAV_LINKS, PRODUCT_CATEGORIES_INFO } from '@/lib/constants';

// IMPORTANT: Replace this with your actual production domain
const BASE_URL = 'https://lakhiramkashiram.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages from NAV_LINKS
  const staticPages = NAV_LINKS.map((link) => ({
    url: `${BASE_URL}${link.href}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as 'monthly',
    priority: link.href === '/' ? 1.0 : (link.href === '/products' ? 0.9 : 0.8),
  }));

  // Product category pages
  const categoryPages = PRODUCT_CATEGORIES_INFO.map((category) => ({
    url: `${BASE_URL}/products/category/${category.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as 'weekly',
    priority: 0.7,
  }));

  // Individual product pages
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts(); // Fetches all products
    productPages = products.map((product) => ({
      url: `${BASE_URL}/products/${product.id}`, // Ensure product.id is the URL-safe slug/identifier
      lastModified: new Date().toISOString(), // Ideally, use product.updatedAt if available
      changeFrequency: 'weekly' as 'weekly',
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
    // Depending on requirements, you might want to re-throw or handle gracefully
  }

  return [
    ...staticPages,
    ...categoryPages,
    ...productPages,
  ];
}
