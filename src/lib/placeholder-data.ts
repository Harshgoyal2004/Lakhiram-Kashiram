
import type { Product } from './types';

// MOCK_PRODUCTS has been removed as products will now be fetched from Firestore.
// You should add your product data to the 'products' collection in your Firebase Firestore database.

// Example structure for a product document in Firestore:
// {
//   "id": "unique_product_id", // Firestore document ID will be used, or you can set your own
//   "name": "Pure Mustard Oil",
//   "description": "Traditional kachi ghani mustard oil, rich in flavor and aroma.",
//   "longDescription": "Our Pure Mustard Oil is extracted from the finest quality mustard seeds...",
//   "price": 180,
//   "imageUrl": "https://placehold.co/600x400.png",
//   "dataAiHint": "mustard oil bottle",
//   "category": "Mustard Oil",
//   "dietaryTags": ["Cold-Pressed", "Unrefined"],
//   "origin": "India",
//   "size": "1L",
//   "stock": 100,
//   "attributes": [{ "key": "Extraction", "value": "Kachi Ghani (Cold-Pressed)" }, { "key": "Best For", "value": "Pickling, Deep Frying, Sautéing" }],
//   "sku": "LRKR-MO-1L",
//   "isFeatured": true // Add this field to mark products as featured
// }


// FEATURED_PRODUCTS_IDS is no longer needed as featured products will be queried from Firestore using the 'isFeatured' flag.
// export const FEATURED_PRODUCTS_IDS = ['1', '3', '4'];
