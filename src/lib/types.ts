
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

// Product interface for informational display
export interface Product {
  id: string;
  name: string;
  description: string; // Short description for card
  longDescription?: string; // Detailed description for detail page
  imageUrl: string;
  dataAiHint?: string; // For placeholder image search
  category?: string; // e.g., "Mustard Oil", "Sesame Oil"
  characteristics?: string[]; // e.g., ["Cold-Pressed", "Organic", "Unrefined"]
  usageTips?: string; // How to best use the oil
  origin?: string;
  packagingOptions?: Array<{ size: string; details?: string }>; // e.g., [{ size: "1L Bottle" }, { size: "5L Tin" }]
  // Fields like price, stock, SKU are omitted for informational site
  isFeatured?: boolean; // To highlight certain products, perhaps on homepage or product page
  attributes?: Array<{ key: string; value: string }>; // For key-value details like "Extraction Method: Kachi Ghani"
}

// Removed CartItem, Order, Filters, SortOption types
