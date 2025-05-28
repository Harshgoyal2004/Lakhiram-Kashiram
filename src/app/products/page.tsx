
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Product } from '@/lib/types';
import ProductList from '@/components/products/ProductList';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';
import { getProducts } from '@/lib/products'; // Assuming this fetches all products

// Note: generateMetadata cannot be used in a Client Component.
// If metadata needs to be dynamic based on fetched products, this page might need restructuring
// or metadata generation could be moved to a parent Server Component or layout.
// For now, keeping static metadata as an example.
// export const metadata: Metadata = {
//   title: `Our Products - ${SITE_NAME}`,
//   description: `Explore the range of high-quality oils offered by ${SITE_NAME}.`,
// };


export default function ProductsPage() {
  const [initialProducts, setInitialProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      const products = await getProducts();
      setInitialProducts(products);
      setIsLoading(false);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (initialProducts.length > 0) {
      const uniqueCategories = Array.from(
        new Set(initialProducts.map(p => p.category).filter(Boolean) as string[])
      ).sort();
      setCategories(uniqueCategories);
    }
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [initialProducts, searchQuery, selectedCategory]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-2xl text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-sienna mb-4">Our Products</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover the premium range of oils from ${SITE_NAME}, crafted with tradition and quality. Each product offers unique benefits and flavors for your culinary and wellness needs.
        </p>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm w-full text-base"
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="max-w-sm w-full text-base">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {filteredProducts.length > 0 ? (
        <ProductList products={filteredProducts} />
      ) : (
        <div className="text-center py-10">
          <p className="text-2xl text-muted-foreground">
            {initialProducts.length === 0 ? 'No products are currently listed.' : 'No products match your criteria.'}
          </p>
          <p className="text-md text-muted-foreground mt-2">
            {initialProducts.length === 0 ? 'Please check back soon or contact us for more information.' : 'Try adjusting your search or filter.'}
          </p>
        </div>
      )}
    </div>
  );
}
