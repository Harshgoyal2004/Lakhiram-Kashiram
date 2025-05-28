"use client";

import { useState, useEffect } from 'react';
import { oilRecommendation, type OilRecommendationOutput } from '@/ai/flows/oil-recommendation';
import type { Product } from '@/lib/types';
import { MOCK_PRODUCTS } from '@/lib/placeholder-data'; // For displaying recommended products
import ProductCard from './ProductCard';
import { Loader2 } from 'lucide-react';

interface AiRecommendationsClientProps {
  userId: string; // Or some user identifier
  purchaseHistory: Pick<Product, "id" | "name" | "category">[];
  currentProductId?: string; // Optional: to exclude current product from recommendations
}

export default function AiRecommendationsClient({ userId, purchaseHistory, currentProductId }: AiRecommendationsClientProps) {
  const [recommendationsOutput, setRecommendationsOutput] = useState<OilRecommendationOutput | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      setIsLoading(true);
      setError(null);
      try {
        // Format purchase history for the AI
        const historyString = purchaseHistory.map(p => `${p.name} (${p.category})`).join(', ');
        if (!historyString && purchaseHistory.length > 0) { // If history is empty, but was intended to be populated
             console.warn("Purchase history is empty, AI recommendations might be generic.");
        }

        const data = await oilRecommendation({ purchaseHistory: historyString || "No specific purchase history available." });
        setRecommendationsOutput(data);

        // Simulate fetching actual product details based on recommendations
        // The AI returns a string, so we need to parse it or use product names to find them in MOCK_PRODUCTS
        // This is a simplified approach. A real app would parse names and fetch by ID/SKU.
        if (data && data.recommendations) {
          const recommendedNames = data.recommendations.toLowerCase().split(',').map(name => name.trim());
          const foundProducts = MOCK_PRODUCTS.filter(p => 
            recommendedNames.some(recName => p.name.toLowerCase().includes(recName)) &&
            p.id !== currentProductId // Exclude current product if on product page
          ).slice(0, 4); // Limit to 4 recommendations
          
          // If AI doesn't find specific products, show some popular ones as fallback
          if (foundProducts.length === 0) {
            setRecommendedProducts(MOCK_PRODUCTS.filter(p => p.id !== currentProductId).slice(0,4));
          } else {
            setRecommendedProducts(foundProducts);
          }
        } else {
           // Fallback if AI provides no recommendations
           setRecommendedProducts(MOCK_PRODUCTS.filter(p => p.id !== currentProductId).slice(0,4));
        }

      } catch (err) {
        console.error("Failed to fetch AI recommendations:", err);
        setError("Could not load recommendations at this time.");
        // Fallback recommendations on error
        setRecommendedProducts(MOCK_PRODUCTS.filter(p => p.id !== currentProductId).slice(0,4));
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecommendations();
  }, [userId, purchaseHistory, currentProductId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
        <Loader2 className="h-12 w-12 text-brand-gold animate-spin mb-4" />
        <p className="text-lg text-muted-foreground">Finding oils tailored for you...</p>
      </div>
    );
  }

  if (error && recommendedProducts.length === 0) { // Only show error if fallback also fails (which it shouldn't here)
    return <p className="text-center text-destructive">{error}</p>;
  }
  
  if (recommendedProducts.length === 0) {
    return <p className="text-center text-muted-foreground">No specific recommendations for you at the moment. Explore our full range!</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      {recommendedProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
