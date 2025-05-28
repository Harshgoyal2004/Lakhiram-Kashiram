import HeroSection from '@/components/pages/home/HeroSection';
import FeaturedProducts from '@/components/pages/home/FeaturedProducts';
import AboutTeaser from '@/components/pages/home/AboutTeaser';
import AiRecommendationsClient from '@/components/products/AiRecommendationsClient';
import { MOCK_USER_ID } from '@/lib/constants';
import { MOCK_PRODUCTS } from '@/lib/placeholder-data';


// Mock purchase history for AI recommendations on homepage
const mockUserPurchaseHistory = [
  MOCK_PRODUCTS[0], // Pure Mustard Oil
  MOCK_PRODUCTS[2], // Extra Virgin Olive Oil
].map(p => ({ id: p.id, name: p.name, category: p.category }));


export default function HomePage() {
  return (
    <div className="space-y-16 md:space-y-24">
      <HeroSection />
      <FeaturedProducts />
      <AboutTeaser />
      <section className="py-16 md:py-24 bg-muted/30 rounded-lg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-sienna mb-4">
              Recommended For You
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Based on your preferences, here are some oils you might love.
            </p>
          </div>
          <AiRecommendationsClient 
            userId={MOCK_USER_ID}
            purchaseHistory={mockUserPurchaseHistory} 
          />
        </div>
      </section>
    </div>
  );
}
