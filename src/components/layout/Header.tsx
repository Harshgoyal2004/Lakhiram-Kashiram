
"use client";
import Link from 'next/link';
// ShoppingBag and User icons might be removed or User kept if a simple login (e.g., for admins) is ever considered.
// For a purely info site, User icon is also likely removed.
// import { User } from 'lucide-react';
import Logo from './Logo';
import MainNav from './MainNav';
import MobileNav from './MobileNav';
// import { Button } from '@/components/ui/button';
// useCart and CartDrawer are removed as they are e-commerce features.

export default function Header() {
  // const { getItemCount, toggleCart, isCartOpen } = useCart(); // Removed

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-20 items-center justify-between">
        <Logo />
        <MainNav />
        <div className="flex items-center space-x-3">
          {/* Cart button removed */}
          {/* Account button removed for a simple informational site */}
          {/* 
          <Link href="/account" legacyBehavior passHref>
            <Button variant="ghost" size="icon" className="hidden md:inline-flex text-foreground hover:text-brand-gold">
              <User className="h-6 w-6" />
              <span className="sr-only">My Account</span>
            </Button>
          </Link>
          */}
          <MobileNav />
        </div>
      </div>
      {/* CartDrawer removed */}
    </header>
  );
}
