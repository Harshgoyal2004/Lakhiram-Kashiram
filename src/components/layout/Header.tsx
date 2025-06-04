
"use client";
import Link from 'next/link';
import Logo from './Logo';
import MainNav from './MainNav';
import MobileNav from './MobileNav';
// Removed Search icon, Button, Input, useState, useRouter, FormEvent as search is moved

export default function Header() {
  // Removed search state and handler

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-20 items-center justify-between">
        <Logo />
        {/* Removed search form from the center */}
        <div className="hidden md:flex flex-1 justify-center px-8 lg:px-16">
          {/* Placeholder for potential future content or can be removed if no center content desired */}
        </div>
        <MainNav />
        <div className="flex items-center space-x-3">
          {/* CartDrawer removed as it was an e-commerce feature */}
          {/* User account button/dropdown removed as it was e-commerce related */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
