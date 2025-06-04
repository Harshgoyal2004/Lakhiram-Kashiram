
"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import type { Product } from '@/lib/types';
import ProductList from '@/components/products/ProductList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getProductsByCategoryName } from '@/lib/products';
import { PRODUCT_CATEGORIES_INFO, type ProductCategoryName } from '@/lib/constants';
import { Loader2, ArrowDownAZ, ArrowUpAZ, ChevronLeft } from 'lucide-react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';

export default function CategoryProductsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [initialProducts, setInitialProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [categoryName, setCategoryName] = useState<ProductCategoryName | null>(null);

  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;

    const categoryInfo = PRODUCT_CATEGORIES_INFO.find(cat => cat.slug === slug);
    if (!categoryInfo) {
      notFound(); 
      return;
    }
    setCategoryName(categoryInfo.name);

    async function fetchProductsData() {
      setIsLoading(true);
      try {
        if (categoryInfo) {
          const products = await getProductsByCategoryName(categoryInfo.name);
          setInitialProducts(products);
        }
      } catch (error) {
        console.error(`Failed to fetch products for category ${categoryInfo?.name}:`, error);
        setInitialProducts([]); 
      } finally {
        setIsLoading(false);
      }
    }
    fetchProductsData();
  }, [slug]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0 && initialProducts && initialProducts.length > 0) {
      const filtered = initialProducts
        .filter(product => product.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);
      setSearchSuggestions(filtered);
      if (filtered.length > 0) {
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false); 
      }
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
    if (!initialProducts) return [];
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
        <p className="text-2xl text-muted-foreground">Loading {categoryName ? `${categoryName} products` : 'products'}...</p>
      </div>
    );
  }
  
  if (!categoryName) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-semibold text-destructive">Category Not Found</h1>
        <p className="text-muted-foreground mt-4">The product category you are looking for does not exist.</p>
        <Link href="/products" passHref>
          <Button variant="outline" className="mt-8">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Categories
          </Button>
        </Link>
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
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-sienna mb-4">{categoryName}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Browse our selection of {categoryName.toLowerCase()}.
        </p>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start">
        <div className="relative w-full max-w-sm" ref={searchContainerRef}>
          <Input
            type="text"
            placeholder={`Search in ${categoryName}...`}
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => {
              if (searchQuery.length > 0 && searchSuggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
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
            {initialProducts && initialProducts.length === 0 ? `No products found in ${categoryName}.` : 'No products match your search.'}
          </p>
          <p className="text-md text-muted-foreground mt-2">
            {initialProducts && initialProducts.length === 0 ? 'Please check back soon or explore other categories.' : 'Try adjusting your search terms.'}
          </p>
        </div>
      )}
    </div>
  );
}
