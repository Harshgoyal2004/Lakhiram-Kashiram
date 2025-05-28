import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

export default function Logo() {
  return (
    <Link href="/" className="text-2xl md:text-3xl font-serif font-bold text-brand-gold hover:opacity-80 transition-opacity">
      {SITE_NAME}
    </Link>
  );
}
