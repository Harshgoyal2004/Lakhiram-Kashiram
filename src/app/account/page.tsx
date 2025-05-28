
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Order } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Package, MapPin, UserCircle2, LogOut, MailCheck, Loader2 } from 'lucide-react';
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
import { upsertUserProfile } from '@/lib/user'; // Ensure this path is correct
import type { UserProfile as AppUserProfile } from '@/lib/types';


const MOCK_USER_PROFILE_DETAILS: Pick<AppUserProfile, "addresses" | "purchaseHistory"> = {
  addresses: [
    { id: "addr1", street: "123 Royal Palms", city: "Mumbai", state: "Maharashtra", zip: "400065", country: "India", isDefault: true, customerName: "Test User", customerEmail: "test@example.com" },
    { id: "addr2", street: "456 Heritage Lane", city: "Delhi", state: "Delhi", zip: "110001", country: "India", customerName: "Test User", customerEmail: "test@example.com" },
  ],
  purchaseHistory: [
    { id: "1", name: "Pure Mustard Oil", category: "Mustard Oil"},
    { id: "3", name: "Extra Virgin Olive Oil", category: "Olive Oil"},
  ]
};

const MOCK_ORDERS: Order[] = [
  { id: "order1", userId: "mockUser", createdAt: new Date() as any, items: [{ id: '1', name: 'Pure Mustard Oil', description: '', price: 180, imageUrl: '', category: 'Mustard Oil', quantity: 2, size: '1L', dataAiHint: "mustard oil" }], totalAmount: 360, status: "Delivered", shippingAddress: MOCK_USER_PROFILE_DETAILS.addresses![0] },
  { id: "order2", userId: "mockUser", createdAt: new Date() as any, items: [{ id: '3', name: 'Extra Virgin Olive Oil', description: '', price: 750, imageUrl: '', category: 'Olive Oil', quantity: 1, size: '750ml', dataAiHint: "olive oil" }], totalAmount: 750, status: "Shipped", shippingAddress: MOCK_USER_PROFILE_DETAILS.addresses![0] },
];

const EMAIL_FOR_SIGN_IN_KEY = 'emailForSignIn';

export default function AccountPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [email, setEmail] = useState('');
  const [linkSent, setLinkSent] = useState(false);
  const [isProcessingLink, setIsProcessingLink] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && isSignInWithEmailLink(auth, window.location.href)) {
      setIsLoadingUser(true);
      let storedEmail = window.localStorage.getItem(EMAIL_FOR_SIGN_IN_KEY);
      if (!storedEmail) {
        storedEmail = window.prompt('Please provide your email for confirmation');
      }

      if (storedEmail) {
        signInWithEmailLink(auth, storedEmail, window.location.href)
          .then(async (result) => {
            setCurrentUser(result.user);
            await upsertUserProfile(result.user);
            window.localStorage.removeItem(EMAIL_FOR_SIGN_IN_KEY);
            toast({ title: "Successfully signed in!", description: `Welcome ${result.user.email || result.user.displayName}` });
            if (window.history && window.history.replaceState) {
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          })
          .catch((error) => {
            console.error("Error signing in with email link:", error);
            const errorCode = (error as any).code;
            const errorMessage = (error as any).message;
            toast({ title: "Sign In Failed", description: `Code: ${errorCode}, Message: ${errorMessage}`, variant: "destructive" });
            if (window.history && window.history.replaceState) {
                window.history.replaceState({}, document.title, window.location.pathname);
            }
          })
          .finally(() => {
            setIsLoadingUser(false);
          });
      } else {
        toast({ title: "Sign In Error", description: "Email for sign-in not found. Please try sending the link again or ensure you open the link on the same device, or provide your email when prompted.", variant: "destructive", duration: 10000 });
        setIsLoadingUser(false);
        if (window.history && window.history.replaceState) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    }
  }, [toast, isLoadingUser, currentUser]);

  const handleSendSignInLink = async (e: FormEvent) => {
    e.preventDefault();
    setIsProcessingLink(true);
    setLinkSent(false);

    if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) {
      console.error("Firebase Auth Domain (NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) is not configured in environment variables.");
      toast({ title: "Configuration Error", description: "Firebase Auth Domain is missing. Please check your .env.local file.", variant: "destructive" });
      setIsProcessingLink(false);
      return;
    }
    
    if (auth.config && auth.config.authDomain) {
        console.log('[AccountPage] Firebase Auth Domain from config:', auth.config.authDomain);
    } else {
        console.warn('[AccountPage] Firebase auth.config.authDomain is not available.');
    }

    const continueUrl = window.location.href; 
    console.log("[AccountPage] Using continue URL for email link sign-in:", continueUrl);

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
      const errorCode = error.code;
      const errorMessage = error.message;
      let detailedDescription = `Code: ${errorCode}, Message: ${errorMessage}.`;

      if (errorCode === 'auth/unauthorized-continue-uri') {
        detailedDescription = `Error: The domain '${new URL(continueUrl).hostname}' (likely 'localhost' for development) is not authorized for email link redirects. 
        Please go to your Firebase Console > Authentication > Sign-in method > Email/Password provider (edit) > Email link (passwordless sign-in) section. 
        Ensure '${new URL(continueUrl).hostname}' is added to the 'Authorized domains' list there.`;
      } else {
        detailedDescription += " Check your browser console for more details.";
      }
      toast({ title: "Failed to Send Link", description: detailedDescription, variant: "destructive", duration: 20000 });
    } finally {
      setIsProcessingLink(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({ title: "Logout Failed", description: error.message, variant: "destructive" });
    }
  };

  if (isLoadingUser) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-brand-gold animate-spin" />
        <p className="ml-4 text-lg">Loading account information...</p>
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
                            <p className="text-sm text-muted-foreground">Date: {new Date(order.createdAt as any).toLocaleDateString()}</p>
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
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3" disabled={isProcessingLink}>
                {isProcessingLink ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Send Sign-In Link"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

