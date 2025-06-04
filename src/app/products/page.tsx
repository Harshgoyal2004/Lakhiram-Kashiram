
"use client"; // This page now needs to be a client component for form handling and suggestions

import { useState, type FormEvent, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { PRODUCT_CATEGORIES_INFO, SITE_NAME } from '@/lib/constants';
import type { Product } from '@/lib/types';
import { getProducts } from '@/lib/products';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ProductsCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchAllProductsData() {
      setIsLoadingProducts(true);
      try {
        const products = await getProducts();
        setAllProducts(products);
      } catch (error) {
        console.error("Failed to fetch all products for suggestions:", error);
        setAllProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    }
    fetchAllProductsData();
  }, []);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0 && allProducts.length > 0) {
      const filtered = allProducts
        .filter(product => product.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5); // Limit to 5 suggestions
      setSearchSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleInputFocus = () => {
    if (searchQuery.length > 0 && allProducts.length > 0) {
      const filtered = allProducts
        .filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5);
      setSearchSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else if (searchQuery.length === 0) {
        setSearchSuggestions([]);
        setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (productName: string) => {
    setSearchQuery(productName);
    setShowSuggestions(false);
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

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-sienna mb-4">Explore Our Products</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Search for specific products or browse by category to discover the diverse range of high-quality oils and extracts offered by {SITE_NAME}.
        </p>
      </div>

      <section className="mb-12">
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto p-4 bg-muted/30 rounded-lg shadow">
          <div className="relative flex items-center gap-2" ref={searchContainerRef}>
            <Input
              type="search"
              placeholder="Search all products (e.g., Almond Oil, Basil Extract...)"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={handleInputFocus}
              className="flex-grow text-base"
              aria-label="Search all products"
            />
            <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Search className="mr-2 h-5 w-5" />
              Search
            </Button>
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                {searchSuggestions.map(suggestion => (
                  <div
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion.name)}
                    className="px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm"
                  >
                    {suggestion.name}
                  </div>
                ))}
              </div>
            )}
          </div>
           {isLoadingProducts && searchQuery.length > 0 && !showSuggestions && (
            <div className="text-center mt-2 text-sm text-muted-foreground">
              <Loader2 className="inline-block mr-1 h-4 w-4 animate-spin" /> Loading suggestions...
            </div>
          )}
        </form>
      </section>
      
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-sienna mb-4">Or Browse by Category</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PRODUCT_CATEGORIES_INFO.map((category) => (
          <Link href={`/products/category/${category.slug}`} key={category.slug} passHref>
            <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg cursor-pointer group">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={category.imageUrl || `https://placehold.co/800x450.png?text=${encodeURIComponent(category.name)}`}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={category.dataAiHint}
                />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl font-serif text-brand-sienna group-hover:text-brand-gold transition-colors">
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-muted-foreground mb-4">
                  {category.description}
                </CardDescription>
                <div className="text-primary font-semibold inline-flex items-center group-hover:underline">
                  View Products <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
