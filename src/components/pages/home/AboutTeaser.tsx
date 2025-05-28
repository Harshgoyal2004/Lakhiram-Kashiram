import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SITE_NAME, COMPANY_TAGLINE, COMPANY_FOUNDING_YEAR } from '@/lib/constants';

export default function AboutTeaser() {
  return (
    <section className="py-16 md:py-24 bg-brand-antique-white/50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Image 
              src="https://placehold.co/800x600.png" 
              alt="Lakhi Ram Kashi Ram historical image or depiction of quality oils"
              width={800}
              height={600}
              className="rounded-lg shadow-xl object-cover"
              data-ai-hint="vintage oil factory"
            />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-sienna mb-6">
              A Century of Trust, <span className="text-brand-gold">A Legacy of Purity</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              Since {COMPANY_FOUNDING_YEAR}, {SITE_NAME} has been synonymous with the finest quality cooking oils. We blend age-old traditions with modern expertise to bring you products that are not just healthy, but also rich in authentic flavor and aroma.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Discover the story behind our commitment to excellence and the values that have guided us for generations.
            </p>
            <Link href="/about" passHref>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
