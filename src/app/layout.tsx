
import type { Metadata } from 'next';
import { Playfair_Display, Lora } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AppProviders from '@/components/AppProviders';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

const faviconUrl = "https://77xomcqrisqpataq.public.blob.vercel-storage.com/logo-KDzDyQ9FDY5Dcvc3LqNOeAw4bYlbOF.png";

export const metadata: Metadata = {
  title: 'Lakhi Ram Kashi Ram Oils - A Legacy of Purity',
  description: 'Discover premium quality cooking oils from Lakhi Ram Kashi Ram, a trusted name for generations.',
  keywords: 'cooking oils, premium oils, Lakhi Ram Kashi Ram, edible oils, healthy oils',
  icons: {
    icon: faviconUrl,
    shortcut: faviconUrl,
    apple: faviconUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${lora.variable}`}>
      <body className="antialiased flex flex-col min-h-screen">
        <AppProviders>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
