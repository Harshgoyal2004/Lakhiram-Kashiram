
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react'; // Removed Search icon
import { Button } from '@/components/ui/button';
// Removed Input and FormEvent as search is moved
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Logo from './Logo';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  // Removed searchQuery state and router as search is moved
  const pathname = usePathname();

  // Removed handleSearchSubmit function

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

            {/* Removed search form from mobile nav */}
            {/* <div className="p-6 border-b border-border"> ... </div> */}

            <nav className="flex flex-col space-y-1 p-6 mt-4"> {/* Added mt-4 for spacing */}
              {NAV_LINKS.map((link) => (
                <SheetClose asChild key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-lg font-medium py-2.5 px-3 rounded-md transition-colors hover:bg-accent/50 hover:text-brand-gold",
                      pathname === link.href ? "bg-accent/50 text-brand-gold" : "text-foreground/80"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
