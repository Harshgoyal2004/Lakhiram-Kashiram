
import HeroSection from '@/components/pages/home/HeroSection';
import FeaturedProducts from '@/components/pages/home/FeaturedProducts';
import AboutTeaser from '@/components/pages/home/AboutTeaser';
import AiRecommendationsClient from '@/components/products/AiRecommendationsClient';
import { MOCK_USER_ID } from '@/lib/constants';
// MOCK_PRODUCTS is removed as products will come from Firestore
// For mock purchase history on homepage, we'll use static data for now.
// In a real app, this would come from the logged-in user's actual history.

// Mock purchase history for AI recommendations on homepage.
// Ensure these product names/categories align with what you might have in Firestore
// or what the AI model is trained on if it doesn't directly use IDs.
const mockUserPurchaseHistory = [
  { id: "1", name: "Pure Mustard Oil", category: "Mustard Oil"}, // Assuming '1' is a valid ID in your Firestore
  { id: "3", name: "Extra Virgin Olive Oil", category: "Olive Oil"}, // Assuming '3' is a valid ID
].map(p => ({ id: p.id, name: p.name, category: p.category }));


export default function HomePage() {
  return (
    <div className="space-y-16 md:space-y-24">
      <HeroSection />
      <FeaturedProducts /> {/* This is now a Server Component fetching from Firestore */}
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
            // initialDisplayProducts could be pre-fetched here if desired
          />
        </div>
      </section>
    </div>
  );
}
