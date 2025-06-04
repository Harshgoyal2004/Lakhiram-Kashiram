
// This file contains functions to fetch product data from Firestore
// for the informational company website.
'use server';

import type { Product } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, limit } from 'firebase/firestore';

// Helper function to convert Firestore document to Product type
function docToProduct(documentSnapshot: any): Product {
  const data = documentSnapshot.data();
  return {
    id: documentSnapshot.id,
    name: data.name || '',
    description: data.description || '',
    longDescription: data.longDescription || '',
    imageUrl: data.imageUrl || 'https://placehold.co/600x400.png',
    dataAiHint: data.dataAiHint || (data.category ? data.category.toLowerCase().split(' ')[0] + ' oil' : 'oil bottle'),
    category: data.category || 'Uncategorized',
    characteristics: data.characteristics || [],
    usageTips: data.usageTips || '',
    origin: data.origin || '',
    packagingOptions: data.packagingOptions || [],
    isFeatured: data.isFeatured || false,
    attributes: data.attributes || [],
  };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const productsCollection = collection(db, 'products');
    const querySnapshot = await getDocs(productsCollection);
    const products = querySnapshot.docs.map(docToProduct);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const productDocRef = doc(db, 'products', id);
    const productDoc = await getDoc(productDocRef);

    if (productDoc.exists()) {
      return docToProduct(productDoc);
    } else {
      console.log("No such product document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
}

export async function getFeaturedProducts(count: number = 3): Promise<Product[]> {
  try {
    const productsCollection = collection(db, 'products');
    const q = query(productsCollection, where("isFeatured", "==", true), limit(count));
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(docToProduct);
    return products;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export async function getProductsByCategoryName(categoryName: string): Promise<Product[]> {
  try {
    const productsCollection = collection(db, 'products');
    const q = query(productsCollection, where("category", "==", categoryName));
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(docToProduct);
    return products;
  } catch (error) {
    console.error(`Error fetching products for category "${categoryName}":`, error);
    return [];
  }
}
