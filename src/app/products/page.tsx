
import { getProducts } from '@/lib/products';
import ProductList from '@/components/products/ProductList';
import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Our Products - ${SITE_NAME}`,
  description: `Explore the range of high-quality oils offered by ${SITE_NAME}.`,
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-sienna mb-4">Our Products</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover the premium range of oils from ${SITE_NAME}, crafted with tradition and quality. Each product offers unique benefits and flavors for your culinary and wellness needs.
        </p>
      </div>
      
      {products.length > 0 ? (
        <ProductList products={products} />
      ) : (
        <div className="text-center py-10">
          <p className="text-2xl text-muted-foreground">No products are currently listed.</p>
          <p className="text-md text-muted-foreground mt-2">Please check back soon or contact us for more information.</p>
        </div>
      )}
    </div>
  );
}
