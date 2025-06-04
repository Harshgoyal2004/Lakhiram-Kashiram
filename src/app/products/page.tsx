
"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import type { Product } from '@/lib/types';
import ProductList from '@/components/products/ProductList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/products';
import { Loader2, ArrowDownAZ, ArrowUpAZ } from 'lucide-react';

export default function ProductsPage() {
  const [initialProducts, setInitialProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // 'asc' for A-Z, 'desc' for Z-A

  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    async function fetchProductsData() {
      setIsLoading(true);
      try {
        const products = await getProducts();
        setInitialProducts(products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProductsData();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 0) {
      const suggestions = initialProducts
        .filter(product => product.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSearchSuggestions([]);
    }
  };

  const handleSuggestionClick = (product: Product) => {
    setSearchQuery(product.name);
    setShowSuggestions(false);
    setSearchSuggestions([]);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const filteredAndSortedProducts = useMemo(() => {
    let products = initialProducts.filter(product => {
      return product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    });

    products.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    return products;
  }, [initialProducts, searchQuery, sortOrder]);


  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-brand-gold animate-spin mb-4" />
        <p className="text-2xl text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-sienna mb-4">Our Products</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover the premium range of oils from Lakhi Ram Kashi Ram Oils, crafted with tradition and quality. Each product offers unique benefits and flavors for your culinary and wellness needs.
        </p>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start">
        <div className="relative w-full max-w-sm" ref={searchContainerRef}>
          <Input
            type="text"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery.length > 0 && setSearchSuggestions(initialProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0,5))}
            className="text-base"
          />
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto">
              {searchSuggestions.map(suggestion => (
                <div
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm"
                >
                  {suggestion.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <Button onClick={toggleSortOrder} variant="outline" className="max-w-sm w-full text-base">
          Sort by Name 
          {sortOrder === 'asc' ? <ArrowDownAZ className="ml-2 h-5 w-5" /> : <ArrowUpAZ className="ml-2 h-5 w-5" />}
        </Button>
      </div>
      
      {filteredAndSortedProducts.length > 0 ? (
        <ProductList products={filteredAndSortedProducts} />
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
