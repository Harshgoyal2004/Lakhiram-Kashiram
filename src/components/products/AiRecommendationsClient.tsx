
"use client";

import { useState, useEffect } from 'react';
import { oilRecommendation, type OilRecommendationOutput } from '@/ai/flows/oil-recommendation';
import type { Product } from '@/lib/types';
import { getSampleProducts } from '@/lib/products'; // To fetch actual products for display
import ProductCard from './ProductCard';
import { Loader2 } from 'lucide-react';

interface AiRecommendationsClientProps {
  userId: string;
  purchaseHistory: Pick<Product, "id" | "name" | "category">[];
  currentProductId?: string;
  initialDisplayProducts?: Product[]; // Optional: pre-fetched products to display
}

export default function AiRecommendationsClient({ 
  userId, 
  purchaseHistory, 
  currentProductId,
  initialDisplayProducts 
}: AiRecommendationsClientProps) {
  const [recommendationsOutput, setRecommendationsOutput] = useState<OilRecommendationOutput | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>(initialDisplayProducts || []);
  const [isLoading, setIsLoading] = useState(!initialDisplayProducts || initialDisplayProducts.length === 0); // Load if no initial products
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAndProcessRecommendations() {
      setIsLoading(true);
      setError(null);
      let displayProducts: Product[] = [];

      try {
        const historyString = purchaseHistory.map(p => `${p.name} (${p.category})`).join(', ');
        if (!historyString && purchaseHistory.length > 0) {
             console.warn("Purchase history is empty, AI recommendations might be generic.");
        }

        const aiData = await oilRecommendation({ purchaseHistory: historyString || "No specific purchase history available." });
        setRecommendationsOutput(aiData);

        if (aiData && aiData.recommendations) {
          const recommendedNames = aiData.recommendations.toLowerCase().split(',').map(name => name.trim());
          // Fetch products from DB based on names - this is a simplified match
          // A more robust system would involve the AI returning IDs or SKUs
          const allProducts = await getSampleProducts(10); // Fetch a larger pool to search from
          
          const foundProducts = allProducts.filter(p =>
            recommendedNames.some(recName => p.name.toLowerCase().includes(recName)) &&
            p.id !== currentProductId
          ).slice(0, 4);

          displayProducts = foundProducts;
        }
      } catch (err) {
        console.error("Failed to fetch AI recommendations:", err);
        setError("Could not load AI recommendations. Showing some popular items.");
      } finally {
        // Fallback if AI fails or finds nothing
        if (displayProducts.length === 0) {
          const fallbackProducts = await getSampleProducts(4, currentProductId);
          displayProducts = fallbackProducts;
        }
        setRecommendedProducts(displayProducts);
        setIsLoading(false);
      }
    }

    // If initialDisplayProducts were provided and are sufficient, don't fetch immediately,
    // unless we want to always refresh AI based on new context (e.g. if purchaseHistory changes)
    // For now, if initialDisplayProducts are there, we use them and then fetch AI.
    // If you want AI to always run, remove the initialDisplayProducts check from isLoading initial state.
    fetchAndProcessRecommendations();

  }, [userId, purchaseHistory, currentProductId]); // Removed initialDisplayProducts from deps to allow AI to re-fetch

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
        <Loader2 className="h-12 w-12 text-brand-gold animate-spin mb-4" />
        <p className="text-lg text-muted-foreground">Finding oils tailored for you...</p>
      </div>
    );
  }

  if (error && recommendedProducts.length === 0) {
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
