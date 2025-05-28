
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { NAV_LINKS, SITE_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Logo from './Logo';
import { useCart } from '@/hooks/useCart';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { getItemCount } = useCart();

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-foreground hover:text-brand-gold">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full max-w-xs bg-background p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <Logo />
              <SheetClose asChild>
                 <Button variant="ghost" size="icon" className="text-foreground hover:text-brand-gold">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close menu</span>
                  </Button>
              </SheetClose>
            </div>
            <nav className="flex flex-col space-y-2 p-6">
              {NAV_LINKS.map((link) => (
                <SheetClose asChild key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-lg font-medium py-2 px-3 rounded-md transition-colors hover:bg-accent/50 hover:text-brand-gold",
                      pathname === link.href ? "bg-accent/50 text-brand-gold" : "text-foreground/80"
                    )}
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
            <div className="mt-auto p-6 border-t border-border">
              <div className="flex items-center space-x-4">
                <SheetClose asChild>
                    <Link href="/account" className="flex items-center space-x-2 text-foreground/80 hover:text-brand-gold">
                        <User className="h-5 w-5" />
                        <span>Account</span>
                    </Link>
                </SheetClose>
                <SheetClose asChild>
                    <Link href="/cart" className="flex items-center space-x-2 text-foreground/80 hover:text-brand-gold relative">
                        <ShoppingBag className="h-5 w-5" />
                        <span>Cart</span>
                        {getItemCount() > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            {getItemCount()}
                          </span>
                        )}
                    </Link>
                </SheetClose>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
