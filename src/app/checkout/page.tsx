
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CreditCard, Lock, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import type { User } from 'firebase/auth';
import type { Address } from '@/lib/types';

export default function CheckoutPage() {
  const { cartItems, getCartTotal, getItemCount, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingDetails, setShippingDetails] = useState<Omit<Address, "id" | "isDefault">>({
    customerName: '',
    customerEmail: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India', // Default country
  });

  const [mockPayment, setMockPayment] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      if (user) {
        setShippingDetails(prev => ({
          ...prev,
          customerName: user.displayName || '',
          customerEmail: user.email || '',
        }));
      }
      setIsLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  if (isLoadingUser) {
    return (
      <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <Loader2 className="w-16 h-16 text-brand-gold animate-spin mb-4" />
        <p className="text-lg text-muted-foreground">Loading checkout...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <Lock className="w-24 h-24 text-brand-gold mb-8" strokeWidth={1.5} />
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-sienna mb-6">
          Please Sign In
        </h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-md">
          You need to be signed in to proceed with checkout.
        </p>
        <Link href={`/account?redirect=/checkout`} passHref>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Sign In to Continue
          </Button>
        </Link>
      </div>
    );
  }

  if (getItemCount() === 0 && !isProcessing) {
    return (
      <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <ShoppingBag className="w-24 h-24 text-brand-gold mb-8" strokeWidth={1.5} />
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-sienna mb-6">
          Your Cart is Empty
        </h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-md">
          Add some oils to your cart before you can checkout.
        </p>
        <Link href="/products" passHref>
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <ArrowLeft className="mr-2 h-5 w-5" /> Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMockPayment({ ...mockPayment, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast({ title: "Authentication Error", description: "You must be logged in to place an order.", variant: "destructive" });
      return;
    }
    setIsProcessing(true);

    const orderPayload = {
      userId: currentUser.uid,
      items: cartItems,
      totalAmount: getCartTotal(),
      shippingAddress: shippingDetails,
      // mockPaymentDetails: mockPayment, // We are not sending mock payment details to API for now
    };

    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create order.');
      }

      toast({
        title: "Order Placed Successfully!",
        description: `Your order ID is ${result.orderId}.`,
        duration: 7000,
      });
      clearCart(); // Clear cart on successful order
      router.push(`/account?tab=orders&order_id=${result.orderId}`); // Redirect to account page, orders tab

    } catch (error: any) {
      console.error("Error placing order:", error);
      toast({
        title: "Order Placement Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-sienna mb-4">Checkout</h1>
        <p className="text-lg text-muted-foreground">Complete your order by providing the details below.</p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid lg:grid-cols-3 gap-12 items-start">
        {/* Shipping & Payment Details */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-card shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-brand-sienna">Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="customerName">Full Name</Label>
                  <Input id="customerName" name="customerName" value={shippingDetails.customerName} onChange={handleShippingChange} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input id="customerEmail" name="customerEmail" type="email" value={shippingDetails.customerEmail} onChange={handleShippingChange} required />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="street">Street Address</Label>
                <Input id="street" name="street" value={shippingDetails.street} onChange={handleShippingChange} required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" value={shippingDetails.city} onChange={handleShippingChange} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="state">State / Province</Label>
                  <Input id="state" name="state" value={shippingDetails.state} onChange={handleShippingChange} required />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="zip">Zip / Postal Code</Label>
                  <Input id="zip" name="zip" value={shippingDetails.zip} onChange={handleShippingChange} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" name="country" value={shippingDetails.country} onChange={handleShippingChange} required />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-brand-sienna">Payment Details (Simulation)</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                This is a mock payment form. Do not enter real card details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="cardNumber">Card Number</Label>
                <div className="relative">
                  <Input id="cardNumber" name="cardNumber" value={mockPayment.cardNumber} onChange={handlePaymentChange} placeholder="xxxx xxxx xxxx xxxx" required />
                  <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input id="expiryDate" name="expiryDate" value={mockPayment.expiryDate} onChange={handlePaymentChange} placeholder="MM/YY" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" name="cvc" value={mockPayment.cvc} onChange={handlePaymentChange} placeholder="123" required />
                </div>
              </div>
              <Alert variant="default" className="bg-yellow-50 border-yellow-300 text-yellow-700">
                <Lock className="h-5 w-5 text-yellow-600" />
                <AlertTitle className="font-semibold">Simulation Only</AlertTitle>
                <AlertDescription>
                  No actual payment will be processed. This is for demonstration purposes.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <aside className="lg:col-span-1 sticky top-24">
          <Card className="shadow-xl bg-card">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-brand-sienna">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="truncate max-w-[150px]">{item.name} (x{item.quantity})</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>Free (for now)</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold text-foreground">
                <span>Total</span>
                <span>₹{getCartTotal().toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3" disabled={isProcessing || getItemCount() === 0}>
                {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CreditCard className="mr-2 h-5 w-5" />}
                {isProcessing ? "Processing..." : "Place Order"}
              </Button>
            </CardFooter>
          </Card>
        </aside>
      </form>
    </div>
  );
}
