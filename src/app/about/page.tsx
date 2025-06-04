
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
        <div className="grid md:grid-cols-1 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-serif font-semibold text-brand-sienna mb-6 text-center md:text-left">Our Story</h2>
            <div className="text-lg text-foreground/80 leading-relaxed space-y-4">
              <p>
                Founded in {COMPANY_FOUNDING_YEAR} by the visionary Late Shri Surajbhan Gupta, {SITE_NAME} embarked on its journey with a profound commitment to delivering unparalleled quality and fostering unwavering trust. This foundational ethos became the cornerstone of our identity, guiding every endeavor.
              </p>
              <p>
                The precious legacy established by Late Shri Surajbhan Gupta was meticulously nurtured and significantly expanded by his son, the esteemed Late Shri Kedarnath Gupta. With dedication and foresight, he steered the company through new horizons, always upholding the principles of integrity and excellence.
              </p>
              <p>
                Today, under the dynamic and forward-thinking leadership of Mr. Vishal Goyal, {SITE_NAME} continues to honor its rich heritage. We blend time-honored traditions with modern innovations, ensuring that every product and service reflects our enduring commitment to quality. As we evolve, our core values remain steadfast, inspiring us to reach new heights of customer satisfaction and industry leadership.
              </p>
              <p>
                For generations, our name has been synonymous with reliability and authenticity. We cherish the trust placed in us by millions and strive to strengthen these bonds by consistently delivering products that meet the highest standards of purity and efficacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16 py-12 bg-muted/30 rounded-lg px-6">
        <h2 className="text-3xl font-serif font-semibold text-brand-sienna text-center mb-10">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="mx-auto w-16 h-16 bg-brand-gold text-brand-sienna rounded-full flex items-center justify-center mb-4 text-3xl font-serif">Q</div>
            <h3 className="text-xl font-serif font-semibold text-brand-sienna mb-2">Quality</h3>
            <p className="text-foreground/70">From sourcing raw materials to final delivery, we maintain rigorous quality checks to ensure purity and excellence.</p>
          </div>
          <div>
            <div className="mx-auto w-16 h-16 bg-brand-gold text-brand-sienna rounded-full flex items-center justify-center mb-4 text-3xl font-serif">T</div>
            <h3 className="text-xl font-serif font-semibold text-brand-sienna mb-2">Tradition</h3>
            <p className="text-foreground/70">We honor traditional methods while embracing innovation to preserve the natural goodness and efficacy of our products.</p>
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
          We invite you to experience the {SITE_NAME} difference. Explore our range of offerings and become a part of a tradition that values health, taste, and unwavering quality.
        </p>
      </section>
    </div>
  );
}
