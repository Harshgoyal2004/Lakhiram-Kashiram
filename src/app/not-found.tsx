import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center justify-center text-center min-h-[60vh]">
      <SearchX className="w-24 h-24 text-brand-gold mb-8" strokeWidth={1.5}/>
      <h1 className="text-5xl md:text-7xl font-serif font-bold text-brand-sienna mb-6">
        404 - Page Not Found
      </h1>
      <p className="text-xl text-muted-foreground mb-10 max-w-md">
        Oops! The page you're looking for doesn't seem to exist. It might have been moved or deleted.
      </p>
      <div className="flex space-x-4">
        <Link href="/" passHref>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Go to Homepage
          </Button>
        </Link>
        <Link href="/products" passHref>
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Browse Products
          </Button>
        </Link>
      </div>
    </div>
  );
}
