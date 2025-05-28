import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Product } from '@/lib/types';
import { MOCK_PRODUCTS } from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AddToCartButton from '@/components/products/AddToCartButton';
import EnhancedDescriptionClient from '@/components/products/EnhancedDescriptionClient';
import AiRecommendationsClient from '@/components/products/AiRecommendationsClient';
import { MOCK_USER_ID } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';


// Simulate API call for a single product
async function getProductById(id: string): Promise<Product | undefined> {
  // In a real app, this would be an API call
  return new Promise(resolve => 
    setTimeout(() => resolve(MOCK_PRODUCTS.find(p => p.id === id)), 300)
  );
}

// Mock purchase history for AI recommendations on product page
const mockUserPurchaseHistoryForProductPage = (currentProductId: string) => 
 MOCK_PRODUCTS.filter(p => p.id !== currentProductId)
  .slice(0, 2) // take two other products
  .map(p => ({ id: p.id, name: p.name, category: p.category }));


export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Product Image Gallery */}
        <div className="relative aspect-square rounded-lg overflow-hidden shadow-xl border border-border">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
            priority // Prioritize loading of main product image
            data-ai-hint={product.dataAiHint || "product detail image"}
          />
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-brand-sienna">{product.name}</h1>
          
          <div className="flex items-center space-x-2">
            {/* Placeholder for reviews */}
            <div className="flex text-brand-gold">
              {[...Array(5)].map((_, i) => <Star key={i} className={i < 4 ? "fill-current h-5 w-5" : "h-5 w-5"} />)}
            </div>
            <span className="text-sm text-muted-foreground">(12 Reviews)</span>
          </div>

          <p className="text-3xl font-semibold text-brand-burgundy">
            ₹{product.price.toFixed(2)}
            {product.size && <span className="text-base text-muted-foreground ml-2">/ {product.size}</span>}
          </p>

          {product.stock && product.stock > 0 && (
             <Badge variant={product.stock < 10 ? "destructive" : "secondary"} className="bg-green-100 text-green-700 border-green-300">
              {product.stock < 10 ? `Only ${product.stock} left!` : "In Stock"}
            </Badge>
          )}
           {product.stock === 0 && (
             <Badge variant="destructive">Out of Stock</Badge>
          )}

          <p className="text-lg text-foreground/80 leading-relaxed">{product.description}</p>
          
          {product.dietaryTags && product.dietaryTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.dietaryTags.map(tag => (
                <Badge key={tag} variant="outline" className="border-accent text-accent-foreground">{tag}</Badge>
              ))}
            </div>
          )}

          <AddToCartButton product={product} />

          <Separator className="my-8" />

          {product.longDescription && (
            <div>
              <h2 className="text-2xl font-serif font-semibold text-brand-sienna mb-3">Product Details</h2>
              <p className="text-foreground/70 whitespace-pre-line">{product.longDescription}</p>
            </div>
          )}

          {product.attributes && product.attributes.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-serif font-semibold text-brand-sienna mb-2">Key Attributes</h3>
              <ul className="list-disc list-inside space-y-1 text-foreground/70">
                {product.attributes.map(attr => (
                  <li key={attr.key}><strong>{attr.key}:</strong> {attr.value}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <Separator className="my-12 md:my-16" />

      {/* Enhanced AI Description Section */}
      <section className="py-8 md:py-12 bg-muted/30 rounded-lg p-6 md:p-10">
        <h2 className="text-3xl font-serif font-bold text-brand-sienna mb-6 text-center">Discover the Legacy</h2>
        <EnhancedDescriptionClient oilName={product.name} />
      </section>

      <Separator className="my-12 md:my-16" />

      {/* AI Recommendations Section */}
      <section className="py-8 md:py-12">
        <h2 className="text-3xl font-serif font-bold text-brand-sienna mb-8 text-center">You Might Also Like</h2>
        <AiRecommendationsClient 
            userId={MOCK_USER_ID} 
            purchaseHistory={mockUserPurchaseHistoryForProductPage(product.id)} 
            currentProductId={product.id}
        />
      </section>
    </div>
  );
}
