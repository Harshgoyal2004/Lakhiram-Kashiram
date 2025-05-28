import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SITE_NAME, COMPANY_TAGLINE, COMPANY_FOUNDING_YEAR } from '@/lib/constants';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-brand-antique-white via-amber-50 to-brand-antique-white py-20 md:py-32 rounded-lg shadow-xl overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <Image 
          src="https://placehold.co/1920x1080.png" // Replace with a fitting background image
          alt="Abstract background representing oil quality"
          layout="fill"
          objectFit="cover"
          quality={75}
          data-ai-hint="oil texture background"
        />
      </div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-brand-sienna mb-6 leading-tight">
          {SITE_NAME}
        </h1>
        <p className="text-xl md:text-2xl text-brand-sienna/80 font-sans mb-4">
          {COMPANY_TAGLINE}
        </p>
        <p className="text-lg md:text-xl text-brand-gold font-semibold mb-10">
          Trusted Quality Since {COMPANY_FOUNDING_YEAR}
        </p>
        <Link href="/products" passHref>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg transition-transform hover:scale-105">
            Explore Our Oils
          </Button>
        </Link>
      </div>
    </section>
  );
}
