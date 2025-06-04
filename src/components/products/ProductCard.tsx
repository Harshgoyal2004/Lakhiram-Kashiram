
import type React from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  if (!product) return null;

  const displayCategory = product.category && product.category !== 'Uncategorized';

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      {/* CardHeader with Image removed */}
      <CardContent className="flex flex-col flex-grow p-6 space-y-3">
        <CardTitle className="text-2xl font-serif text-brand-sienna">{product.name}</CardTitle>
        <CardDescription className="text-muted-foreground line-clamp-3 flex-grow">
          {product.description}
        </CardDescription>
        {displayCategory && (
          <p className="text-sm text-brand-gold font-medium">{product.category}</p>
        )}
        <div className="mt-auto pt-4">
          <Link href={`/products/${product.id}`} passHref>
            <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary hover:text-primary-foreground">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
