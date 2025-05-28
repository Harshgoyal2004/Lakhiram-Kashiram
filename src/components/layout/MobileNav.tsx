
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react'; // ShoppingBag, User icons removed
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { NAV_LINKS } from '@/lib/constants'; // SITE_NAME might be used for Logo if needed
import { cn } from '@/lib/utils';
import Logo from './Logo';
// useCart removed

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  // const { getItemCount } = useCart(); // Removed

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
              <SheetClose asChild><Logo /></SheetClose>
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
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
            {/* Bottom section with account/cart links removed */}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
