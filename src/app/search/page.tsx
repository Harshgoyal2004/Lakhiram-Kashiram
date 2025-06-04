
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Product } from '@/lib/types';
import { getProducts } from '@/lib/products';
import ProductList from '@/components/products/ProductList';
import { Loader2, SearchX } from 'lucide-react';
import { SITE_NAME } from '@/lib/constants';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAndFilterProducts() {
      setIsLoading(true);
      setError(null);
      try {
        const products = await getProducts();
        setAllProducts(products);
      } catch (err) {
        console.error("Failed to fetch products for search:", err);
        setError("Could not load product data. Please try again later.");
        setAllProducts([]);
      }
    }
    fetchAndFilterProducts();
  }, []); // Fetch all products only once on component mount

  useEffect(() => {
    if (allProducts.length > 0 && query) {
      const lowerCaseQuery = query.toLowerCase();
      const results = allProducts.filter(product =>
        product.name.toLowerCase().includes(lowerCaseQuery) ||
        (product.description && product.description.toLowerCase().includes(lowerCaseQuery)) ||
        (product.category && product.category.toLowerCase().includes(lowerCaseQuery)) ||
        (product.longDescription && product.longDescription.toLowerCase().includes(lowerCaseQuery))
      );
      setFilteredProducts(results);
    } else if (query === null || query.trim() === "") {
      // No query, show nothing or a prompt to search
      setFilteredProducts([]);
    } else {
      // Query exists but no products loaded yet (or empty allProducts)
      setFilteredProducts([]);
    }
    setIsLoading(false); // Moved here to ensure it's set after filtering
  }, [query, allProducts]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <SearchX className="mx-auto h-16 w-16 text-destructive mb-4" />
        <h1 className="text-3xl font-semibold text-destructive mb-2">Search Error</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }
  
  if (isLoading && !query) { // Initial loading before any search attempt
    return (
      <div className="container mx-auto px-4 py-12 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-brand-gold animate-spin mb-4" />
        <p className="text-2xl text-muted-foreground">Loading products...</p>
      </div>
    );
  }


  if (!query || query.trim() === "") {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <SearchX className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-3xl font-semibold text-brand-sienna">Search {SITE_NAME}</h1>
        <p className="text-muted-foreground mt-2">Enter a term in the search bar above to find products.</p>
      </div>
    );
  }
  
  // This loading state is specifically for when a query is present but filtering is happening
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-brand-gold animate-spin mb-4" />
        <p className="text-2xl text-muted-foreground">Searching for "{query}"...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/products" passHref>
          <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to All Categories
          </Button>
        </Link>
      </div>
      <h1 className="text-4xl font-serif font-bold text-brand-sienna mb-2">
        Search Results for "{query}"
      </h1>
      <p className="text-muted-foreground mb-8">
        Found {filteredProducts.length} product(s).
      </p>

      {filteredProducts.length > 0 ? (
        <ProductList products={filteredProducts} />
      ) : (
        <div className="text-center py-10">
          <SearchX className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-2xl text-muted-foreground">No products found matching "{query}".</p>
          <p className="text-md text-muted-foreground mt-2">Try a different search term or browse our categories.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  // Suspense is necessary because useSearchParams() is used in SearchResults
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-brand-gold animate-spin mb-4" />
        <p className="text-2xl text-muted-foreground">Loading search...</p>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
