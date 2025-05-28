"use client";

import type React from 'react';
import { CartProvider } from '@/context/CartContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}
