
"use client";
import Link from 'next/link';
import { ShoppingBag, User } from 'lucide-react';
import Logo from './Logo';
import MainNav from './MainNav';
import MobileNav from './MobileNav';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import CartDrawer from '@/components/cart/CartDrawer'; // Will create this next

export default function Header() {
  const { getItemCount, toggleCart, isCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-20 items-center justify-between">
        <Logo />
        <MainNav />
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="hidden md:inline-flex text-foreground hover:text-brand-gold" onClick={toggleCart}>
            <ShoppingBag className="h-6 w-6" />
            {getItemCount() > 0 && (
              <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {getItemCount()}
              </span>
            )}
            <span className="sr-only">Open cart</span>
          </Button>
          <Link href="/account" legacyBehavior passHref>
            <Button variant="ghost" size="icon" className="hidden md:inline-flex text-foreground hover:text-brand-gold">
              <User className="h-6 w-6" />
              <span className="sr-only">My Account</span>
            </Button>
          </Link>
          <MobileNav />
        </div>
      </div>
      <CartDrawer isOpen={isCartOpen} onClose={toggleCart} />
    </header>
  );
}
