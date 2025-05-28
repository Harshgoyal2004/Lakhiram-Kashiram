"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_USER_ID } from '@/lib/constants';
import type { UserProfile, Order } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { Package, MapPin, UserCircle2, LogOut } from 'lucide-react';

// Mock user data for logged-in state
const MOCK_USER_PROFILE: UserProfile = {
  id: MOCK_USER_ID,
  name: "Aarav Sharma",
  email: "aarav.sharma@example.com",
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
  { id: "order1", date: "2024-05-15T10:30:00Z", items: [{ id: '1', name: 'Pure Mustard Oil', description: '', price: 180, imageUrl: '', category: 'Mustard Oil', quantity: 2, size: '1L' }], totalAmount: 360, status: "Delivered", shippingAddress: MOCK_USER_PROFILE.addresses![0] },
  { id: "order2", date: "2024-06-01T14:00:00Z", items: [{ id: '3', name: 'Extra Virgin Olive Oil', description: '', price: 750, imageUrl: '', category: 'Olive Oil', quantity: 1, size: '750ml' }], totalAmount: 750, status: "Shipped", shippingAddress: MOCK_USER_PROFILE.addresses![0] },
];


export default function AccountPage() {
  // Simulate auth state. In a real app, this would come from an auth context/hook.
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    setIsLoggedIn(true);
    setCurrentUser(MOCK_USER_PROFILE);
  };
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock signup & login
    setIsLoggedIn(true);
    setCurrentUser({ ...MOCK_USER_PROFILE, name: "New User", email: "newuser@example.com" }); // Example new user
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  if (isLoggedIn && currentUser) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-sienna mb-4 md:mb-0">Welcome, {currentUser.name}</h1>
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
                <div><Label>Name:</Label><p className="text-lg">{currentUser.name}</p></div>
                <div><Label>Email:</Label><p className="text-lg">{currentUser.email}</p></div>
                <Button>Edit Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="bg-card shadow-lg">
              <CardHeader><CardTitle className="text-2xl font-serif text-brand-sienna">Order History</CardTitle></CardHeader>
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
              <CardHeader><CardTitle className="text-2xl font-serif text-brand-sienna">Manage Addresses</CardTitle></CardHeader>
              <CardContent>
                {currentUser.addresses && currentUser.addresses.length > 0 ? (
                  <ul className="space-y-4">
                    {currentUser.addresses.map(addr => (
                      <li key={addr.id} className="p-4 border border-border rounded-md bg-background/50">
                        <p className="font-semibold">{addr.street}, {addr.city}, {addr.state} - {addr.zip}</p>
                        {addr.isDefault && <Badge className="mt-1">Default</Badge>}
                        <div className="mt-2 space-x-2">
                           <Button variant="link" className="p-0 h-auto text-primary">Edit</Button>
                           <Button variant="link" className="p-0 h-auto text-destructive">Delete</Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : <p>You have no saved addresses.</p>}
                <Button className="mt-6">Add New Address</Button>
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
                  <Input id="login-email" type="email" placeholder="you@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" type="password" required />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3">Login</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card className="bg-card shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl font-serif text-brand-sienna">Create an Account</CardTitle>
              <CardDescription>Join {MOCK_USER_ID} and unlock a world of premium oils and personalized offers.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input id="signup-name" type="text" placeholder="Your Name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" placeholder="you@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" required />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3">Create Account</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
