
import type { Timestamp } from 'firebase/firestore';

// UserProfile might be simplified or removed if no user login is needed for the informational site.
// Keeping a basic structure if some form of admin login might be added later.
export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
  createdAt?: Timestamp;
  lastLoginAt?: Timestamp;
  // Addresses and purchaseHistory are likely not needed for a simple info site.
}

// Address might be used if contact forms collect detailed address or for company location.
export interface Address {
  id?: string;
  customerName?: string; // Or just 'name'
  customerEmail?: string; // Or just 'email'
  street: string;
  city: string;
  state: string;
  zip: string;
  country:string;
}

export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Removed Product, CartItem, Order, Filters, SortOption types
