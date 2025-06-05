
import type { Metadata } from 'next';
import { Playfair_Display, Lora } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AppProviders from '@/components/AppProviders';
import { SITE_NAME } from '@/lib/constants';

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
  title: SITE_NAME, // Changed to use SITE_NAME for simplicity and consistency
  description: 'Discover premium quality cooking oils, extracts, and ingredients from Lakhi Ram Kashi Ram, a trusted name for generations.',
  keywords: 'cooking oils, essential oils, spice oils, carrier oils, extracts, premium ingredients, Lakhi Ram Kashi Ram, edible oils, healthy oils, ayurvedic products',
  icons: {
    icon: faviconUrl,
    shortcut: faviconUrl,
    apple: faviconUrl,
  },
  openGraph: {
    title: SITE_NAME, // Ensure Open Graph title is also updated
    description: 'Discover premium quality cooking oils, extracts, and ingredients from Lakhi Ram Kashi Ram, a trusted name for generations.',
    images: [
      {
        url: faviconUrl, // You might want a more specific Open Graph image here
        width: 800, // Example width
        height: 600, // Example height
        alt: `${SITE_NAME} Logo`,
      },
    ],
    type: 'website',
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
