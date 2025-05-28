
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-base font-medium transition-colors hover:text-brand-gold",
            pathname === link.href ? "text-brand-gold" : "text-foreground/80"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
