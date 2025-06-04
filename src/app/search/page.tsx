
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
  const [isLoading, setIsLoading] = useState(true); // Start true as we will always be loading or deciding what to show
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch products if there's a query.
    // If no query, the component will render the "prompt to search" message.
    if (query && query.trim() !== "") {
      setIsLoading(true); // Set loading true when a new query initiates fetching/filtering
      setError(null);
      async function fetchProductsData() {
        try {
          const products = await getProducts();
          setAllProducts(products);
        } catch (err) {
          console.error("Failed to fetch products for search:", err);
          setError("Could not load product data. Please try again later.");
          setAllProducts([]); // Ensure allProducts is an empty array on error
          setIsLoading(false); // Stop loading on error
        }
      }
      fetchProductsData();
    } else {
      // No query, so not loading products for a search. Clear products and set loading to false.
      setAllProducts([]);
      setFilteredProducts([]);
      setIsLoading(false);
    }
  }, [query]); // Re-run when the query changes

  useEffect(() => {
    // This effect filters products whenever allProducts changes (after fetching)
    // or if the query changes (though fetching is also tied to query change).
    if (query && query.trim() !== "" && allProducts.length > 0) {
      const lowerCaseQuery = query.toLowerCase();
      const results = allProducts.filter(product =>
        product.name.toLowerCase().includes(lowerCaseQuery) ||
        (product.description && product.description.toLowerCase().includes(lowerCaseQuery)) ||
        (product.category && product.category.toLowerCase().includes(lowerCaseQuery)) ||
        (product.longDescription && product.longDescription.toLowerCase().includes(lowerCaseQuery))
      );
      setFilteredProducts(results);
      setIsLoading(false); // Filtering is done, so stop loading
    } else if (query && query.trim() !== "" && allProducts.length === 0 && !error && isLoading) {
      // This case means products are still being fetched (isLoading is true from query effect)
      // No need to set isLoading false here, let the fetchProductsData or its error handling do it.
    } else {
      // Handles cases like: no query, or query but no products fetched yet (and not an error state that already set isLoading false)
      // Or allProducts is empty after fetch (not an error).
      if (query && query.trim() !== "") { // Only stop loading if there was a query attempt
         setIsLoading(false);
      }
    }
  }, [query, allProducts, error, isLoading]); // Added isLoading and error to dependencies for more robust state changes


  // 1. Handle case of no search query (or only whitespace)
  if (!query || query.trim() === "") {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
         <div className="mb-8">
            <Link href="/products" passHref>
              <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to All Categories
              </Button>
            </Link>
          </div>
        <SearchX className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-3xl font-semibold text-brand-sienna">Search {SITE_NAME}</h1>
        <p className="text-muted-foreground mt-2">Enter a term in the search bar on the products page to find products.</p>
      </div>
    );
  }

  // 2. Handle loading state if a query is present
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-brand-gold animate-spin mb-4" />
        <p className="text-2xl text-muted-foreground">Searching for "{query}"...</p>
      </div>
    );
  }

  // 3. Handle error state after loading attempt
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <SearchX className="mx-auto h-16 w-16 text-destructive mb-4" />
        <h1 className="text-3xl font-semibold text-destructive mb-2">Search Error</h1>
        <p className="text-muted-foreground">{error}</p>
         <div className="mt-8">
            <Link href="/products" passHref>
              <Button variant="outline">
                <ChevronLeft className="mr-2 h-4 w-4" /> Try searching again
              </Button>
            </Link>
        </div>
      </div>
    );
  }

  // 4. Display results or no results message
  // At this point, query is valid, isLoading is false, error is null.
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/products" passHref>
          <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Products Page
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
