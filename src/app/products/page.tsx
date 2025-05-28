// src/app/products/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Product, Filters, SortOption } from '@/lib/types';
import { MOCK_PRODUCTS } from '@/lib/placeholder-data';
import ProductList from '@/components/products/ProductList';
import ProductFilters from '@/components/products/ProductFilters';
import ProductSort from '@/components/products/ProductSort';
import { PRODUCT_CATEGORIES, DIETARY_TAGS } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

// Simulate API call for products
async function getProducts(): Promise<Product[]> {
  // In a real app, this would be an API call
  return new Promise(resolve => setTimeout(() => resolve(MOCK_PRODUCTS), 500));
}

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    category: [],
    dietaryTags: [],
    priceRange: [0, 1000], // Default price range, adjust as needed
    searchQuery: '',
  });
  const [sortOption, setSortOption] = useState<SortOption>('latest');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const products = await getProducts();
      setAllProducts(products);
      setFilteredProducts(products); // Initially, all products are shown
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  const maxPrice = useMemo(() => {
    return allProducts.length > 0 ? Math.max(...allProducts.map(p => p.price)) : 1000;
  }, [allProducts]);


  useEffect(() => {
    let currentProducts = [...allProducts];

    // Apply search query filter
    if (filters.searchQuery) {
      currentProducts = currentProducts.filter(product =>
        product.name.toLowerCase().includes(filters.searchQuery!.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.searchQuery!.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category && filters.category.length > 0) {
      currentProducts = currentProducts.filter(product =>
        filters.category!.includes(product.category)
      );
    }

    // Apply dietary tags filter
    if (filters.dietaryTags && filters.dietaryTags.length > 0) {
      currentProducts = currentProducts.filter(product =>
        product.dietaryTags?.some(tag => filters.dietaryTags!.includes(tag))
      );
    }

    // Apply price range filter
    if (filters.priceRange) {
      currentProducts = currentProducts.filter(product =>
        product.price >= filters.priceRange![0] && product.price <= filters.priceRange![1]
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'price-asc':
        currentProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        currentProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        currentProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        currentProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'latest': // Assuming products are fetched in some order, or use an ID/date field
      default:
        // Keep original order or sort by ID if available
        currentProducts.sort((a,b) => parseInt(a.id) - parseInt(b.id)); // Example sort by ID
        break;
    }

    setFilteredProducts(currentProducts);
  }, [filters, sortOption, allProducts]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchQuery: event.target.value }));
  };

  if (isLoading && allProducts.length === 0) { // Show initial loading only when allProducts is empty
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <h1 className="text-4xl font-serif font-bold text-brand-sienna mb-8">Our Oils</h1>
          <p className="text-lg text-muted-foreground">Loading our exquisite collection...</p>
          {/* Add some skeleton loaders here */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mt-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card p-4 rounded-lg shadow animate-pulse">
                <div className="aspect-[4/3] bg-muted rounded-md mb-4"></div>
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-sienna mb-4">Our Exquisite Oils</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our wide range of premium cooking oils, crafted with tradition and care for your well-being.
        </p>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Input 
            type="search" 
            placeholder="Search oils..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <ProductSort currentSort={sortOption} onSortChange={setSortOption} />
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-1/4 xl:w-1/5">
          <ProductFilters 
            filters={filters} 
            setFilters={setFilters} 
            categories={PRODUCT_CATEGORIES}
            dietaryTags={DIETARY_TAGS}
            maxPrice={maxPrice}
          />
        </aside>
        <main className="w-full lg:w-3/4 xl:w-4/5">
          {isLoading && <p className="text-center text-muted-foreground">Filtering products...</p>}
          {!isLoading && <ProductList products={filteredProducts} />}
        </main>
      </div>
    </div>
  );
}
