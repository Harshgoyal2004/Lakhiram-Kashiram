"use client";

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import CartItemDisplay from './CartItemDisplay';
import { ShoppingBag, X } from 'lucide-react';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, getCartTotal, getItemCount, clearCart } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-background p-0">
        <SheetHeader className="p-6 border-b border-border flex-row justify-between items-center">
          <SheetTitle className="text-2xl font-serif text-brand-sienna">Your Shopping Cart</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-brand-gold">
              <X className="h-6 w-6" />
              <span className="sr-only">Close cart</span>
            </Button>
          </SheetClose>
        </SheetHeader>

        {getItemCount() === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
            <ShoppingBag className="h-20 w-20 text-muted-foreground/50 mb-6" strokeWidth={1}/>
            <p className="text-xl font-semibold text-muted-foreground mb-2">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
            <SheetClose asChild>
                <Link href="/products" passHref>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Start Shopping
                </Button>
                </Link>
            </SheetClose>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-grow p-6 pr-3"> {/* pr-3 for scrollbar spacing */}
              <div className="space-y-4">
                {cartItems.map(item => (
                  <CartItemDisplay key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="p-6 border-t border-border space-y-4">
              <div className="flex justify-between text-lg font-semibold text-foreground">
                <span>Subtotal:</span>
                <span>₹{getCartTotal().toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground text-center">Shipping & taxes calculated at checkout.</p>
              <div className="space-y-2">
                <SheetClose asChild>
                    <Link href="/checkout" passHref className="block">
                    <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        Proceed to Checkout
                    </Button>
                    </Link>
                </SheetClose>
                <SheetClose asChild>
                    <Link href="/cart" passHref className="block">
                        <Button variant="outline" size="lg" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                            View Full Cart
                        </Button>
                    </Link>
                </SheetClose>
              </div>
               {getItemCount() > 0 && (
                <Button variant="link" onClick={clearCart} className="text-destructive hover:text-destructive/80 p-0 h-auto text-sm mx-auto block">
                  Clear Cart
                </Button>
              )}
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
