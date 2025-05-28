"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { CartItem } from '@/lib/types';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Minus } from 'lucide-react';

interface CartItemDisplayProps {
  item: CartItem;
}

export default function CartItemDisplay({ item }: CartItemDisplayProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newQuantity = parseInt(e.target.value);
    if (isNaN(newQuantity) || newQuantity < 1) {
      newQuantity = 1;
    }
    if (item.stock && newQuantity > item.stock) {
        newQuantity = item.stock;
    }
    updateQuantity(item.id, newQuantity);
  };

  const incrementQuantity = () => {
    if (item.stock && item.quantity < item.stock) {
        updateQuantity(item.id, item.quantity + 1);
    } else if (!item.stock) {
        updateQuantity(item.id, item.quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id); // Remove if quantity becomes 0
    }
  };


  return (
    <div className="flex items-start space-x-4 py-4">
      <Link href={`/products/${item.id}`} className="flex-shrink-0">
        <div className="relative h-20 w-20 rounded-md overflow-hidden border border-border">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="80px"
            className="object-cover"
            data-ai-hint={item.dataAiHint || "cart item image"}
          />
        </div>
      </Link>
      <div className="flex-grow">
        <Link href={`/products/${item.id}`} className="hover:text-brand-gold transition-colors">
          <h3 className="text-base font-semibold text-foreground">{item.name}</h3>
        </Link>
        {item.size && <p className="text-xs text-muted-foreground">{item.size}</p>}
        <p className="text-sm font-medium text-primary mt-1">₹{(item.price * item.quantity).toFixed(2)}</p>
        <div className="flex items-center mt-2">
          <Button variant="outline" size="icon" onClick={decrementQuantity} className="h-8 w-8 rounded-r-none">
            <Minus className="h-3 w-3" />
          </Button>
          <Input
            type="number"
            value={item.quantity}
            onChange={handleQuantityChange}
            className="h-8 w-12 text-center border-y-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
            min="1"
            max={item.stock}
            aria-label={`Quantity for ${item.name}`}
          />
          <Button variant="outline" size="icon" onClick={incrementQuantity} className="h-8 w-8 rounded-l-none" disabled={item.stock ? item.quantity >= item.stock : false}>
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive flex-shrink-0">
        <X className="h-5 w-5" />
        <span className="sr-only">Remove {item.name} from cart</span>
      </Button>
    </div>
  );
}
