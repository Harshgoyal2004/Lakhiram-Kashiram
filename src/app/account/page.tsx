
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_USER_ID } from '@/lib/constants'; // MOCK_USER_ID might be used for mock data unrelated to auth
import type { UserProfile, Order } from '@/lib/types'; // UserProfile here is for MOCK_USER_PROFILE structure
import { Badge } from '@/components/ui/badge';
import { Package, MapPin, UserCircle2, LogOut, MailCheck } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { 
  signOut, 
  onAuthStateChanged,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  type User 
} from 'firebase/auth';
import { useToast } from "@/hooks/use-toast";


// Mock user data for addresses and orders, will be replaced by Firestore later
const MOCK_USER_PROFILE_DETAILS: Pick<UserProfile, "addresses" | "purchaseHistory"> = {
  addresses: [
    { id: "addr1", street: "123 Royal Palms", city: "Mumbai", state: "Maharashtra", zip: "400065", country: "India", isDefault: true },
    { id: "addr2", street: "456 Heritage Lane", city: "Delhi", state: "Delhi", zip: "110001", country: "India" },
  ],
  purchaseHistory: [
    { id: "1", name: "Pure Mustard Oil", category: "Mustard Oil"},
    { id: "3", name: "Extra Virgin Olive Oil", category: "Olive Oil"},
  ]
};

const MOCK_ORDERS: Order[] = [
  { id: "order1", date: "2024-05-15T10:30:00Z", items: [{ id: '1', name: 'Pure Mustard Oil', description: '', price: 180, imageUrl: '', category: 'Mustard Oil', quantity: 2, size: '1L' }], totalAmount: 360, status: "Delivered", shippingAddress: MOCK_USER_PROFILE_DETAILS.addresses![0] },
  { id: "order2", date: "2024-06-01T14:00:00Z", items: [{ id: '3', name: 'Extra Virgin Olive Oil', description: '', price: 750, imageUrl: '', category: 'Olive Oil', quantity: 1, size: '750ml' }], totalAmount: 750, status: "Shipped", shippingAddress: MOCK_USER_PROFILE_DETAILS.addresses![0] },
];

const EMAIL_FOR_SIGN_IN_KEY = 'emailForSignIn';

export default function AccountPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [linkSent, setLinkSent] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && isSignInWithEmailLink(auth, window.location.href)) {
      setLoading(true);
      let storedEmail = window.localStorage.getItem(EMAIL_FOR_SIGN_IN_KEY);
      if (!storedEmail) {
        storedEmail = window.prompt('Please provide your email for confirmation');
      }
      if (storedEmail) {
        signInWithEmailLink(auth, storedEmail, window.location.href)
          .then((result) => {
            setCurrentUser(result.user);
            window.localStorage.removeItem(EMAIL_FOR_SIGN_IN_KEY);
            toast({ title: "Successfully signed in!", description: `Welcome ${result.user.email}` });
            if (window.history && window.history.replaceState) {
                window.history.replaceState({}, document.title, window.location.pathname);
            }
          })
          .catch((error) => {
            console.error("Error signing in with email link:", error);
            toast({ title: "Sign In Failed", description: `Code: ${error.code}, Message: ${error.message}`, variant: "destructive" });
          })
          .finally(() => {
            setLoading(false);
            if (window.history && window.history.replaceState) {
                window.history.replaceState({}, document.title, window.location.pathname);
            }
          });
      } else {
        toast({ title: "Sign In Error", description: "Email for sign-in not found. Please try sending the link again.", variant: "destructive" });
        setLoading(false);
      }
    }
  }, [toast]);

  const handleSendSignInLink = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLinkSent(false);

    // Construct the URL to redirect back to.
    // This must be whitelisted in the Firebase Console for email link sign-in.
    const continueUrl = `${window.location.origin}${window.location.pathname}`;
    console.log("Using continue URL for email link sign-in:", continueUrl); // For debugging

    const actionCodeSettings = {
      url: continueUrl, 
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem(EMAIL_FOR_SIGN_IN_KEY, email);
      setLinkSent(true);
      toast({ 
        title: "Sign-in Link Sent", 
        description: "Please check your email for the sign-in link.",
        duration: 10000 
      });
      setEmail('');
    } catch (error: any) {
      console.error("Error sending sign-in link:", error);
      toast({ title: "Failed to Send Link", description: `Code: ${error.code}, Message: ${error.message}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({ title: "Logout Failed", description: error.message, variant: "destructive" });
    }
  };

  if (loading && !currentUser) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <p>Loading account information...</p> 
      </div>
    );
  }

  if (currentUser) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-sienna mb-4 md:mb-0">
            Welcome, {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
          </h1>
          <Button variant="outline" onClick={handleLogout} className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 gap-2 md:max-w-lg mx-auto mb-8">
            <TabsTrigger value="profile"><UserCircle2 className="mr-2 h-4 w-4 inline-block" />Profile</TabsTrigger>
            <TabsTrigger value="orders"><Package className="mr-2 h-4 w-4 inline-block" />Orders</TabsTrigger>
            <TabsTrigger value="addresses"><MapPin className="mr-2 h-4 w-4 inline-block" />Addresses</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="bg-card shadow-lg">
              <CardHeader><CardTitle className="text-2xl font-serif text-brand-sienna">Personal Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><Label>Name:</Label><p className="text-lg">{currentUser.displayName || "Not set"}</p></div>
                <div><Label>Email:</Label><p className="text-lg">{currentUser.email}</p></div>
                <Button disabled>Edit Profile (Coming Soon)</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="bg-card shadow-lg">
              <CardHeader><CardTitle className="text-2xl font-serif text-brand-sienna">Order History (Mock Data)</CardTitle></CardHeader>
              <CardContent>
                {MOCK_ORDERS.length > 0 ? (
                  <ul className="space-y-6">
                    {MOCK_ORDERS.map(order => (
                      <li key={order.id} className="p-4 border border-border rounded-md bg-background/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-lg text-primary">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">Date: {new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'} className={order.status === 'Delivered' ? 'bg-green-500 text-white' : ''}>{order.status}</Badge>
                        </div>
                        <ul className="mt-2 space-y-1 pl-4">
                          {order.items.map(item => <li key={item.id} className="text-sm">{item.name} (x{item.quantity})</li>)}
                        </ul>
                        <p className="text-right font-semibold mt-2">Total: ₹{order.totalAmount.toFixed(2)}</p>
                      </li>
                    ))}
                  </ul>
                ) : <p>You have no past orders.</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses">
            <Card className="bg-card shadow-lg">
              <CardHeader><CardTitle className="text-2xl font-serif text-brand-sienna">Manage Addresses (Mock Data)</CardTitle></CardHeader>
              <CardContent>
                {MOCK_USER_PROFILE_DETAILS.addresses && MOCK_USER_PROFILE_DETAILS.addresses.length > 0 ? (
                  <ul className="space-y-4">
                    {MOCK_USER_PROFILE_DETAILS.addresses.map(addr => (
                      <li key={addr.id} className="p-4 border border-border rounded-md bg-background/50">
                        <p className="font-semibold">{addr.street}, {addr.city}, {addr.state} - {addr.zip}</p>
                        {addr.isDefault && <Badge className="mt-1">Default</Badge>}
                        <div className="mt-2 space-x-2">
                           <Button variant="link" className="p-0 h-auto text-primary" disabled>Edit</Button>
                           <Button variant="link" className="p-0 h-auto text-destructive" disabled>Delete</Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : <p>You have no saved addresses.</p>}
                <Button className="mt-6" disabled>Add New Address (Coming Soon)</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <Card className="w-full max-w-md bg-card shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-serif text-brand-sienna">Sign In / Create Account</CardTitle>
          <CardDescription>
            {linkSent 
              ? "A sign-in link has been sent to your email. Please check your inbox (and spam folder) and click the link to sign in."
              : "Enter your email to receive a secure sign-in link. No password needed!"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {linkSent ? (
            <div className="text-center py-4">
              <MailCheck className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium">Link Sent!</p>
              <Button variant="link" onClick={() => { setLinkSent(false); setEmail(''); }} className="mt-4">
                Send to a different email or try again
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSendSignInLink} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email-link-email">Email</Label>
                <Input 
                  id="email-link-email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3" disabled={loading}>
                {loading ? "Sending..." : "Send Sign-In Link"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
