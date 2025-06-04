
"use client";
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import Logo from './Logo';
import MainNav from './MainNav';
import MobileNav from './MobileNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Optionally clear search bar after submit
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-20 items-center justify-between">
        <Logo />
        <div className="hidden md:flex flex-1 justify-center px-8 lg:px-16">
          <form onSubmit={handleSearchSubmit} className="w-full max-w-md flex items-center">
            <Input
              type="search"
              placeholder="Search all products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-r-none focus:ring-0 focus:ring-offset-0 border-r-0"
            />
            <Button type="submit" variant="outline" size="icon" className="rounded-l-none border-l-0">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
        </div>
        <MainNav />
        <div className="flex items-center space-x-3">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
