
import ProductList from '@/components/products/ProductList';
import { getFeaturedProducts } from '@/lib/products'; // Updated import
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// This component can be a Server Component
export default async function FeaturedProducts() {
  const featuredProducts = await getFeaturedProducts();

  if (!featuredProducts || featuredProducts.length === 0) {
    return (
        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-sienna mb-4">
                    Our Featured Oils
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                    We are currently curating our featured collection. Check back soon!
                </p>
                <Link href="/products" passHref>
                    <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                    View All Products <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </div>
        </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-sienna mb-4">
            Our Featured Oils
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked selections of our finest and most popular cooking oils, cherished by our customers for their exceptional quality and taste.
          </p>
        </div>
        <ProductList products={featuredProducts} />
        <div className="text-center mt-12">
          <Link href="/products" passHref>
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
              View All Products <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
