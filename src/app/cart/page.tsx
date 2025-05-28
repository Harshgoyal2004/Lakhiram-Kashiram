"use client";

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import CartItemDisplay from '@/components/cart/CartItemDisplay';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { cartItems, getCartTotal, getItemCount, clearCart } = useCart();

  if (getItemCount() === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <ShoppingBag className="h-24 w-24 text-muted-foreground/50 mb-8" strokeWidth={1}/>
        <h1 className="text-4xl font-serif font-bold text-brand-sienna mb-4">Your Cart is Empty</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          Fill it with our exquisite oils to experience purity and taste.
        </p>
        <Link href="/products" passHref>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-sienna mb-4">Shopping Cart</h1>
        <p className="text-lg text-muted-foreground">Review your selected items and proceed to checkout.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map(item => (
            <Card key={item.id} className="overflow-hidden bg-card">
              <CardContent className="p-0"> {/* CartItemDisplay has its own padding */}
                <CartItemDisplay item={item} />
              </CardContent>
            </Card>
          ))}
          {getItemCount() > 0 && (
            <div className="text-right mt-6">
                <Button variant="link" onClick={clearCart} className="text-destructive hover:text-destructive/80 p-0 h-auto text-sm">
                Clear Entire Cart
                </Button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <aside className="lg:col-span-1 sticky top-24"> {/* top-24 to account for header height */}
          <Card className="shadow-xl bg-card">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-brand-sienna">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({getItemCount()} items)</span>
                <span>₹{getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Estimated Shipping</span>
                <span>₹0.00 <span className="text-xs">(Calculated at checkout)</span></span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold text-foreground">
                <span>Total</span>
                <span>₹{getCartTotal().toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/checkout" passHref className="w-full">
                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3">
                  Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5"/>
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </aside>
      </div>
    </div>
  );
}
