// src/app/error.tsx
"use client"; // Error components must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center justify-center text-center min-h-[60vh]">
      <AlertTriangle className="w-24 h-24 text-destructive mb-8" strokeWidth={1.5} />
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-sienna mb-6">
        Something Went Wrong
      </h1>
      <p className="text-lg text-muted-foreground mb-4 max-w-md">
        We apologize for the inconvenience. An unexpected error occurred.
      </p>
      <p className="text-sm text-muted-foreground mb-10">
        Error: {error.message}
      </p>
      <div className="flex space-x-4">
        <Button
          size="lg"
          onClick={
            // Attempt to recover by try-rending the segment
            () => reset()
          }
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Try Again
        </Button>
        <Link href="/" passHref>
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Go to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
