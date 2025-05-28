import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CreditCard, Lock } from 'lucide-react';

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center justify-center text-center min-h-[60vh]">
      <CreditCard className="w-24 h-24 text-brand-gold mb-8" strokeWidth={1.5}/>
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-sienna mb-6">
        Secure Checkout
      </h1>
      <p className="text-xl text-muted-foreground mb-10 max-w-md">
        Our full payment gateway integration is coming soon to provide you with a seamless and secure transaction experience.
      </p>
      <div className="flex items-center text-green-600 mb-10">
        <Lock className="w-5 h-5 mr-2"/>
        <span>Your information will be handled securely.</span>
      </div>
      <div className="space-y-4">
        <p className="text-muted-foreground">For now, please <Link href="/contact" className="text-primary hover:underline">contact us</Link> to place your order.</p>
        <Link href="/products" passHref>
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
