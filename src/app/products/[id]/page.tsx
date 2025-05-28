
import { getProductById, getProducts } from '@/lib/products';
import type { Product } from '@/lib/types';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next';
import { SITE_NAME } from '@/lib/constants';

type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = await getProductById(params.id);

  if (!product) {
    return {
      title: `Product Not Found - ${SITE_NAME}`,
    };
  }

  const openGraphImages = [];
  if (product.imageUrl && product.imageUrl.startsWith('https://')) {
    openGraphImages.push(product.imageUrl);
  }


  return {
    title: `${product.name} - ${SITE_NAME}`,
    description: product.description,
    openGraph: {
      title: `${product.name} - ${SITE_NAME}`,
      description: product.description,
      images: openGraphImages,
    },
  };
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  const placeholderImage = "https://placehold.co/800x800.png";
  const imageUrl = product.imageUrl || placeholderImage;

  if (product.imageUrl && !product.imageUrl.startsWith('https://firebasestorage.googleapis.com/') && !product.imageUrl.startsWith('https://placehold.co/')) {
    console.warn(`[ProductDetailPage] Product "${product.name}" (ID: ${product.id}) has an unusual imageUrl: ${product.imageUrl}. Ensure it's a valid Firebase Storage download URL or a placeholder.`);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/products" passHref>
          <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Products
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="relative aspect-square rounded-lg overflow-hidden shadow-xl">
          <Image
            src={imageUrl}
            alt={product.name || "Product image"}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            data-ai-hint={product.dataAiHint || "oil product detail"}
            priority // Prioritize loading main product image
            onError={(e) => {
              console.error(`[ProductDetailPage] Error loading image for product "${product.name}": ${imageUrl}`, e);
            }}
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-sienna">{product.name}</h1>
          
          {product.category && (
            <Badge variant="secondary" className="text-lg px-4 py-1 bg-brand-gold/20 text-brand-sienna border-brand-gold">
              {product.category}
            </Badge>
          )}

          <p className="text-lg text-foreground/80 leading-relaxed">
            {product.description}
          </p>

          {product.longDescription && (
            <>
              <Separator className="my-6" />
              <h2 className="text-2xl font-serif font-semibold text-brand-sienna mb-3">Detailed Information</h2>
              <div className="prose prose-lg max-w-none text-foreground/80" dangerouslySetInnerHTML={{ __html: product.longDescription.replace(/\n/g, '<br />') }}>
              </div>
            </>
          )}

          {product.characteristics && product.characteristics.length > 0 && (
            <>
              <Separator className="my-6" />
              <h2 className="text-2xl font-serif font-semibold text-brand-sienna mb-3">Key Characteristics</h2>
              <div className="flex flex-wrap gap-2">
                {product.characteristics.map((char, index) => (
                  <Badge key={index} variant="outline" className="text-md px-3 py-1">{char}</Badge>
                ))}
              </div>
            </>
          )}
          
          {product.attributes && product.attributes.length > 0 && (
             <>
              <Separator className="my-6" />
              <h2 className="text-2xl font-serif font-semibold text-brand-sienna mb-3">Additional Details</h2>
              <ul className="space-y-2 text-foreground/80">
                {product.attributes.map((attr, index) => (
                  <li key={index}>
                    <span className="font-semibold">{attr.key}:</span> {attr.value}
                  </li>
                ))}
              </ul>
            </>
          )}

          {product.usageTips && (
            <>
              <Separator className="my-6" />
              <h2 className="text-2xl font-serif font-semibold text-brand-sienna mb-3">Usage Tips</h2>
              <p className="text-foreground/80 leading-relaxed">{product.usageTips}</p>
            </>
          )}

          {product.origin && (
            <>
              <Separator className="my-6" />
              <h2 className="text-2xl font-serif font-semibold text-brand-sienna mb-3">Origin</h2>
              <p className="text-foreground/80">{product.origin}</p>
            </>
          )}

          {product.packagingOptions && product.packagingOptions.length > 0 && (
            <>
              <Separator className="my-6" />
              <h2 className="text-2xl font-serif font-semibold text-brand-sienna mb-3">Packaging Options</h2>
              <ul className="list-disc list-inside text-foreground/80 space-y-1">
                {product.packagingOptions.map((opt, index) => (
                  <li key={index}>
                    {opt.size} {opt.details && `(${opt.details})`}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
       <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground">
            For inquiries about our products, please <Link href="/contact" className="text-primary hover:underline">contact us</Link>.
          </p>
        </div>
    </div>
  );
}
