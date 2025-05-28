import Image from 'next/image';
import { SITE_NAME, COMPANY_TAGLINE, COMPANY_FOUNDING_YEAR } from '@/lib/constants';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-sienna mb-4">{SITE_NAME}</h1>
        <p className="text-2xl text-brand-gold font-semibold">{COMPANY_TAGLINE}</p>
        <p className="text-lg text-muted-foreground mt-2">A Legacy of Trust Since {COMPANY_FOUNDING_YEAR}</p>
      </div>

      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
            <Image 
              src="https://placehold.co/800x600.png" 
              alt="Historical depiction of Lakhi Ram Kashi Ram operations"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              data-ai-hint="vintage oil mill"
            />
          </div>
          <div>
            <h2 className="text-3xl font-serif font-semibold text-brand-sienna mb-6">Our Story</h2>
            <p className="text-lg text-foreground/80 leading-relaxed mb-4">
              For nearly a century, {SITE_NAME} has been a cornerstone in households, providing cooking oils that are synonymous with purity, quality, and authentic taste. Founded in {COMPANY_FOUNDING_YEAR} by visionary entrepreneurs, our journey began with a simple mission: to deliver uncompromised quality to every kitchen.
            </p>
            <p className="text-lg text-foreground/80 leading-relaxed">
              Through generations, we have upheld this commitment, blending time-honored traditions of oil extraction and processing with modern innovations to ensure that every drop of our oil meets the highest standards of excellence. Our name is built on the trust of millions, a trust we cherish and strive to strengthen with each product we offer.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16 py-12 bg-muted/30 rounded-lg px-6">
        <h2 className="text-3xl font-serif font-semibold text-brand-sienna text-center mb-10">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="mx-auto w-16 h-16 bg-brand-gold text-brand-sienna rounded-full flex items-center justify-center mb-4 text-3xl font-serif">Q</div>
            <h3 className="text-xl font-serif font-semibold text-brand-sienna mb-2">Quality</h3>
            <p className="text-foreground/70">From seed selection to packaging, we maintain rigorous quality checks to ensure purity and nutritional value.</p>
          </div>
          <div>
            <div className="mx-auto w-16 h-16 bg-brand-gold text-brand-sienna rounded-full flex items-center justify-center mb-4 text-3xl font-serif">T</div>
            <h3 className="text-xl font-serif font-semibold text-brand-sienna mb-2">Tradition</h3>
            <p className="text-foreground/70">We honor traditional methods like kachi ghani (cold press) to preserve the natural goodness of oils.</p>
          </div>
          <div>
            <div className="mx-auto w-16 h-16 bg-brand-gold text-brand-sienna rounded-full flex items-center justify-center mb-4 text-3xl font-serif">C</div>
            <h3 className="text-xl font-serif font-semibold text-brand-sienna mb-2">Customer Trust</h3>
            <p className="text-foreground/70">Our customers are at the heart of everything we do. Their satisfaction and well-being are our top priorities.</p>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-serif font-semibold text-brand-sienna mb-6">Join Our Legacy</h2>
        <p className="text-lg text-foreground/80 leading-relaxed max-w-2xl mx-auto">
          We invite you to experience the {SITE_NAME} difference. Explore our range of oils and become a part of a tradition that values health, taste, and unwavering quality.
        </p>
      </section>
    </div>
  );
}
