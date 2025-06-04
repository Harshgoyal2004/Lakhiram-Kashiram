import Link from 'next/link';
import { SITE_NAME, COMPANY_TAGLINE } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t border-border/40 text-muted-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-serif font-semibold text-brand-gold mb-4">{SITE_NAME}</h3>
            <p className="text-sm">{COMPANY_TAGLINE}</p>
            <p className="text-sm mt-2">© {currentYear} {SITE_NAME}. All rights reserved.</p>
          </div>
          <div>
            <h4 className="text-lg font-serif font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-brand-gold transition-colors">Products</Link></li>
              <li><Link href="/about" className="hover:text-brand-gold transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-brand-gold transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border/40 pt-8 text-center text-xs">
          <p>Designed with heritage, crafted for today.</p>
        </div>
      </div>
    </footer>
  );
}
