
import HeroSection from '@/components/pages/home/HeroSection';
import AboutTeaser from '@/components/pages/home/AboutTeaser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react'; // Example icon

// FeaturedProducts and AiRecommendationsClient are removed

export default function HomePage() {
  return (
    <div className="space-y-16 md:space-y-24">
      <HeroSection />
      
      <section className="py-16 md:py-24 bg-muted/30 rounded-lg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-sienna mb-6">
            Your Trusted Partner in Quality Oils
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-10">
            For generations, Lakhi Ram Kashi Ram Oils has been synonymous with excellence in the oil industry. We are committed to sourcing, processing, and delivering the finest quality oils, adhering to the highest standards of purity and ethical practices.
          </p>
          {/* Add more informational content here, similar to pnppexim.com */}
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
                  Our commitment to ethical practices extends to our sourcing, ensuring fair treatment and sustainability.
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
                  We prioritize our clients' needs, offering tailored solutions and reliable service to foster long-term partnerships.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
