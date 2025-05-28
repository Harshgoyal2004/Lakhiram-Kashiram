import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-[200]">
      <Loader2 className="h-16 w-16 text-brand-gold animate-spin" />
      <p className="mt-4 text-lg font-semibold text-brand-sienna">Loading Your Royal Experience...</p>
    </div>
  );
}
