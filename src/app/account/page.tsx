
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_USER_ID } from '@/lib/constants'; // MOCK_USER_ID might be used for mock data unrelated to auth
import type { UserProfile, Order } from '@/lib/types'; // UserProfile here is for MOCK_USER_PROFILE structure
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Package, MapPin, UserCircle2, LogOut } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
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


export default function AccountPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For signup form

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Logged In", description: "Welcome back!" });
      setEmail('');
      setPassword('');
    } catch (error: any) {
      console.error("Login error:", error);
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
    }
  };
  
  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Note: To set the displayName, you'd typically call updateProfile on the user object from the result.
      // For now, Firebase might pick up the name from Google Sign-In if that's how the account was first created.
      toast({ title: "Signup Successful", description: "Your account has been created." });
      setEmail('');
      setPassword('');
      setName('');
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({ title: "Signup Failed", description: error.message, variant: "destructive" });
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "Signed In with Google", description: "Welcome!" });
    } catch (error: any) {
      console.error("Google Sign-in error object:", error); // Log the full error object
      let errorMessage = "An unexpected error occurred during Google Sign-In.";
      if (error.code) {
        errorMessage = `Error (${error.code}): ${error.message}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast({ title: "Google Sign-in Failed", description: errorMessage, variant: "destructive" });
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

  if (loading) {
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

  // If not logged in, show Login/Signup forms
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card className="bg-card shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl font-serif text-brand-sienna">Welcome Back</CardTitle>
              <CardDescription>Login to access your account and continue your royal shopping experience.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3">Login</Button>
              </form>
              <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <Button variant="outline" onClick={handleGoogleSignIn} className="w-full mt-6">
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                Sign in with Google
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card className="bg-card shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl font-serif text-brand-sienna">Create an Account</CardTitle>
              <CardDescription>Join and unlock a world of premium oils and personalized offers.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name (Optional)</Label>
                  <Input id="signup-name" type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" placeholder="Must be at least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3">Create Account</Button>
              </form>
              <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <Button variant="outline" onClick={handleGoogleSignIn} className="w-full mt-6">
                 <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                Sign in with Google
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    