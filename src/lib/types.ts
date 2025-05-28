
import type { Timestamp } from 'firebase/firestore'; // Import Timestamp

export interface Product {
  id: string;
  name: string;
  description: string; // Short description for product cards
  longDescription?: string; // Detailed description for product page
  price: number;
  imageUrl: string;
  category: string; // e.g., "Mustard Oil", "Sesame Oil", "Olive Oil"
  dietaryTags?: string[]; // e.g., "Organic", "Cold-Pressed", "Refined"
  origin?: string; // e.g., "India", "Spain"
  size?: string; // e.g., "1L", "500ml"
  stock?: number;
  attributes?: { key: string; value: string }[]; // e.g. {key: "Extraction", value: "Cold-Pressed"}
  sku?: string;
  dataAiHint?: string; // For placeholder images
  isFeatured?: boolean; // For featured products
}

export interface CartItem extends Product {
  quantity: number;
}

export interface UserProfile {
  uid: string; // Use uid from Firebase Auth
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
  createdAt?: Timestamp; // Use Firestore Timestamp
  lastLoginAt?: Timestamp; // Use Firestore Timestamp
  addresses?: Address[];
  purchaseHistory?: Pick<Product, "id" | "name" | "category">[];
}

export interface Address {
  id?: string; // Optional if embedded
  customerName: string;
  customerEmail: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export interface Order {
  id?: string; // Firestore document ID will be auto-generated or set after creation
  userId: string; // Firebase Auth UID of the user who placed the order
  createdAt: Timestamp; // Firestore server timestamp
  items: CartItem[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: Address;
  billingAddress?: Address; // Optional, can be same as shipping
  // Mock payment details - not for real transactions
  mockPaymentDetails?: {
    transactionId: string; // A simulated transaction ID
  };
}

export interface Filters {
  category?: string[];
  dietaryTags?: string[];
  priceRange?: [number, number];
  searchQuery?: string;
  // Add other filter criteria as needed
}

export type SortOption =
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | "latest";
