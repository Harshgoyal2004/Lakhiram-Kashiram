
// src/lib/products.ts
'use server';

import { collection, getDocs, doc, getDoc, query, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product } from './types';

export async function getProducts(): Promise<Product[]> {
  try {
    const productsCol = collection(db, 'products');
    const productSnapshot = await getDocs(productsCol);
    const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    return productList;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const productRef = doc(db, 'products', id);
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
      return { id: productSnap.id, ...productSnap.data() } as Product;
    } else {
      console.log("No such product!");
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return undefined;
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('isFeatured', '==', true), limit(4)); // Get up to 4 featured products
    const querySnapshot = await getDocs(q);
    const featuredList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    return featuredList;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

// Helper to get a few sample products for recommendations UI or fallbacks
export async function getSampleProducts(count: number = 4, excludeId?: string): Promise<Product[]> {
  try {
    let productsRef = collection(db, 'products');
    // This is a simplified query. For more complex exclusion or randomization, more advanced queries or multiple queries might be needed.
    let q = query(productsRef, limit(count + (excludeId ? 1 : 0) )); // Fetch a bit more if excluding one

    const querySnapshot = await getDocs(q);
    let sampleList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

    if (excludeId) {
      sampleList = sampleList.filter(p => p.id !== excludeId);
    }
    
    return sampleList.slice(0, count);

  } catch (error) {
    console.error("Error fetching sample products:", error);
    return [];
  }
}
