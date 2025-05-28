"use client";

import type React from 'react';
import type { Filters } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface ProductFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  categories: string[];
  dietaryTags: string[];
  maxPrice: number;
}

export default function ProductFilters({ filters, setFilters, categories, dietaryTags, maxPrice }: ProductFiltersProps) {
  
  const handleCategoryChange = (category: string) => {
    setFilters(prev => {
      const newCategories = prev.category?.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...(prev.category || []), category];
      return { ...prev, category: newCategories };
    });
  };

  const handleTagChange = (tag: string) => {
    setFilters(prev => {
      const newTags = prev.dietaryTags?.includes(tag)
        ? prev.dietaryTags.filter(t => t !== tag)
        : [...(prev.dietaryTags || []), tag];
      return { ...prev, dietaryTags: newTags };
    });
  };

  const handlePriceChange = (newPriceRange: [number, number]) => {
    setFilters(prev => ({ ...prev, priceRange: newPriceRange }));
  };

  const clearFilters = () => {
    setFilters({
      category: [],
      dietaryTags: [],
      priceRange: [0, maxPrice],
      searchQuery: filters.searchQuery // Preserve search query
    });
  };
  
  const activeFilterCount = (filters.category?.length || 0) + (filters.dietaryTags?.length || 0) + (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) ? 1 : 0);


  return (
    <div className="p-6 bg-card rounded-lg shadow-md border border-border space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-serif font-semibold text-brand-sienna">Filters</h3>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-primary hover:text-primary/80">
            Clear All
          </Button>
        )}
      </div>
      
      <Accordion type="multiple" defaultValue={['category', 'price', 'tags']} className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger className="text-lg font-semibold hover:text-brand-gold">Category</AccordionTrigger>
          <AccordionContent className="pt-2 space-y-2">
            {categories.map(category => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`cat-${category}`}
                  checked={filters.category?.includes(category)}
                  onCheckedChange={() => handleCategoryChange(category)}
                />
                <Label htmlFor={`cat-${category}`} className="font-normal text-foreground/80">{category}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-lg font-semibold hover:text-brand-gold">Price Range</AccordionTrigger>
          <AccordionContent className="pt-4 space-y-3">
            <Slider
              min={0}
              max={maxPrice}
              step={10}
              value={filters.priceRange || [0, maxPrice]}
              onValueChange={(value) => handlePriceChange(value as [number, number])}
              className="[&>span:first-child]:h-1 [&>span:first-child>span]:bg-primary [&>span:last-child]:bg-primary"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₹{filters.priceRange?.[0] ?? 0}</span>
              <span>₹{filters.priceRange?.[1] ?? maxPrice}</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tags">
          <AccordionTrigger className="text-lg font-semibold hover:text-brand-gold">Dietary Preferences</AccordionTrigger>
          <AccordionContent className="pt-2 space-y-2">
            {dietaryTags.map(tag => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox
                  id={`tag-${tag}`}
                  checked={filters.dietaryTags?.includes(tag)}
                  onCheckedChange={() => handleTagChange(tag)}
                />
                <Label htmlFor={`tag-${tag}`} className="font-normal text-foreground/80">{tag}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
