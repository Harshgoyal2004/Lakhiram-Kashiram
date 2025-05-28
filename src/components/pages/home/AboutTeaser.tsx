
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SITE_NAME, COMPANY_FOUNDING_YEAR } from '@/lib/constants';

export default function AboutTeaser() {
  return (
    <section className="py-16 md:py-24 bg-brand-antique-white/50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Image 
              src="https://placehold.co/800x600.png" 
              alt="Image representing the company's heritage or operations"
              width={800}
              height={600}
              className="rounded-lg shadow-xl object-cover"
              data-ai-hint="company team meeting"
            />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-sienna mb-6">
              Our Legacy, <span className="text-brand-gold">Your Trust</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              Since {COMPANY_FOUNDING_YEAR}, {SITE_NAME} has built a reputation on integrity, quality, and unwavering commitment to our clients. We are leaders in the oil industry, dedicated to innovation and sustainable practices.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Discover the journey, values, and people that define our company and drive our success.
            </p>
            <Link href="/about" passHref>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                Read Our Story
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
