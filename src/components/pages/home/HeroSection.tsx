
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SITE_NAME, COMPANY_TAGLINE, COMPANY_FOUNDING_YEAR } from '@/lib/constants';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-brand-antique-white via-amber-50 to-brand-antique-white py-20 md:py-32 rounded-lg shadow-xl overflow-hidden">
      {/* The div containing the background image has been removed */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-brand-sienna mb-6 leading-tight">
          {SITE_NAME}
        </h1>
        <p className="text-xl md:text-2xl text-brand-sienna/80 font-sans mb-4">
          {COMPANY_TAGLINE}
        </p>
        <p className="text-lg md:text-xl text-brand-gold font-semibold mb-10">
          A Tradition of Excellence Since {COMPANY_FOUNDING_YEAR}
        </p>
        <Link href="/about" passHref>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg transition-transform hover:scale-105">
            Learn More About Us
          </Button>
        </Link>
      </div>
    </section>
  );
}
