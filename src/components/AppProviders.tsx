
"use client";

import type React from 'react';
// CartProvider is removed as it's an e-commerce feature.
// Other global providers could be added here if needed in the future.

interface AppProvidersProps {
  children: React.ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <>
      {children}
    </>
  );
}
