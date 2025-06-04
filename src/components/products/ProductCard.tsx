
import type React from 'react';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  if (!product) return null;

  const displayCategory = product.category && product.category !== 'Uncategorized';

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardContent className="flex flex-col flex-grow p-6 space-y-3">
        <CardTitle className="text-2xl font-serif text-brand-sienna">{product.name}</CardTitle>
        <CardDescription className="text-muted-foreground line-clamp-3 flex-grow">
          {product.description}
        </CardDescription>
        {displayCategory && (
          <p className="text-sm text-brand-gold font-medium">{product.category}</p>
        )}
      </CardContent>
    </Card>
  );
}
