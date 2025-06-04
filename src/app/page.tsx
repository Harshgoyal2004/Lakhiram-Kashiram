
import HeroSection from '@/components/pages/home/HeroSection';
import AboutTeaser from '@/components/pages/home/AboutTeaser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Building2, UtensilsCrossed, FlaskConical, Sparkles, Factory, Leaf } from 'lucide-react';
import { SITE_NAME } from '@/lib/constants';

const industries = [
  { name: 'Hotels', icon: Building2, description: "Premium ingredients for exceptional hospitality." },
  { name: 'Restaurants', icon: UtensilsCrossed, description: "Flavorful solutions for culinary excellence." },
  { name: 'Pharmaceuticals', icon: FlaskConical, description: "High-purity components for health and wellness." },
  { name: 'Cosmetic Industries', icon: Sparkles, description: "Natural ingredients for beauty and personal care." },
  { name: 'Tobacco Industries', icon: Leaf, description: "Quality additives and flavorings." },
];

export default function HomePage() {
  return (
    <div className="space-y-16 md:space-y-24">
      <HeroSection />
      
      <section className="py-16 md:py-24 bg-muted/30 rounded-lg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-sienna mb-6">
            Your Trusted Partner in Quality Ingredients & Commodities
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-10">
            For generations, {SITE_NAME} has been a hallmark of excellence in oils, extracts, and related commodities. We are dedicated to ethical sourcing, meticulous processing, and reliable supply, upholding the highest standards of quality and integrity in all our operations.
          </p>
        </div>
      </section>

      <AboutTeaser />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-sienna mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide our business and relationships.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-brand-sienna">
                  <CheckCircle className="mr-2 h-6 w-6 text-brand-gold" /> Quality Assurance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We implement rigorous quality control at every stage, from sourcing raw materials to final packaging, ensuring product excellence.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-brand-sienna">
                  <CheckCircle className="mr-2 h-6 w-6 text-brand-gold" /> Ethical Sourcing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our commitment to ethical practices extends to our sourcing, ensuring fair treatment and sustainability across our supply chains.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-brand-sienna">
                  <CheckCircle className="mr-2 h-6 w-6 text-brand-gold" /> Customer Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We prioritize our clients' needs, offering tailored solutions and reliable service to foster long-term partnerships and satisfaction.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30 rounded-lg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-sienna mb-4">
              Industries We Serve
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Delivering excellence and quality ingredients across diverse sectors.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {industries.map((industry) => (
              <Card key={industry.name} className="shadow-lg hover:shadow-xl transition-shadow text-center">
                <CardHeader className="flex flex-col items-center">
                  <industry.icon className="h-12 w-12 text-brand-gold mb-3" />
                  <CardTitle className="text-xl font-serif text-brand-sienna">{industry.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{industry.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
