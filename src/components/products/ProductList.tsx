
import type React from 'react';
import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  if (!products || products.length === 0) {
    return <p className="text-center text-muted-foreground text-lg py-10">No products available at the moment. Please check back later.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
