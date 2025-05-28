"use client";

import type React from 'react';
import type { SortOption } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';

interface ProductSortProps {
  currentSort: SortOption;
  onSortChange: (sortOption: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'latest', label: 'Latest Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
];

export default function ProductSort({ currentSort, onSortChange }: ProductSortProps) {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="sort-products" className="text-sm font-medium text-muted-foreground whitespace-nowrap">Sort by:</Label>
      <Select value={currentSort} onValueChange={(value: SortOption) => onSortChange(value)}>
        <SelectTrigger id="sort-products" className="w-auto sm:w-[180px] bg-card border-border focus:ring-brand-gold">
          <SelectValue placeholder="Select sorting" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
