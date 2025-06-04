
import Link from 'next/link';
import { SITE_NAME, COMPANY_TAGLINE } from '@/lib/constants';
// Social icons would be imported here if they were being used, e.g.
// import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  // const socialLinks = [
  //   { href: '#', icon: Facebook, label: 'Facebook' },
  //   { href: '#', icon: Twitter, label: 'Twitter' },
  //   { href: '#', icon: Instagram, label: 'Instagram' },
  //   { href: '#', icon: Linkedin, label: 'LinkedIn' },
  // ];

  const GST_NUMBER = "07AACFL4653Q1ZT";
  const FSSAI_NUMBER = "13320001000652";

  return (
    <footer className="bg-muted/50 border-t border-border/40 text-muted-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2"> {/* Left Column - takes more space */}
            <h3 className="text-xl font-serif font-semibold text-brand-gold mb-4">{SITE_NAME}</h3>
            <p className="text-sm mb-4">{COMPANY_TAGLINE}</p>
            {/* Address was not previously in the footer, it's on the contact page */}
          </div>
          <div> {/* Right Column - takes less space */}
            <h4 className="text-lg font-serif font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-brand-gold transition-colors">Products</Link></li>
              <li><Link href="/about" className="hover:text-brand-gold transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-brand-gold transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          {/* Connect with us column has been removed. */}
        </div>
        <div className="mt-12 border-t border-border/40 pt-8 text-center text-xs">
          <p>© {currentYear} {SITE_NAME}. All rights reserved.</p>
          <p>Designed with heritage, crafted for today.</p>
          <div className="mt-4 space-y-1 md:space-y-0 md:space-x-4">
            <p className="inline-block md:mr-4">GSTIN: {GST_NUMBER}</p>
            <p className="inline-block">FSSAI Lic. No.: {FSSAI_NUMBER}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
