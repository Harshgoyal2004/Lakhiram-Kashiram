
// src/lib/orders.ts
'use server'; // Can be used by server components or API routes

import { collection, addDoc, serverTimestamp, getDocs, query, where, orderBy, type Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order } from './types';

/**
 * Creates an order document in Firestore.
 * This function is intended to be called from server-side logic (e.g., an API route).
 * @param orderData - The order data, excluding id and createdAt (which will be set here).
 * @returns The ID of the newly created order document.
 */
export async function createOrderInFirestore(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<string> {
  try {
    const orderWithTimestamp = {
      ...orderData,
      createdAt: serverTimestamp() as Timestamp, // Firestore will convert this
      status: orderData.status || 'Pending', // Default status
    };
    const ordersCol = collection(db, 'orders');
    const docRef = await addDoc(ordersCol, orderWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error("Error creating order in Firestore:", error);
    throw new Error("Could not create order in database.");
  }
}

/**
 * Fetches orders for a specific user.
 * @param userId - The UID of the user whose orders to fetch.
 * @returns A promise that resolves to an array of orders.
 */
export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  if (!userId) {
    console.warn("getOrdersByUserId called without a userId.");
    return [];
  }
  try {
    const ordersRef = collection(db, 'orders');
    // Ensure you have an index in Firestore for this query: orders collection, userId field (ascending/descending), createdAt field (descending)
    const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Ensure createdAt is converted from Firestore Timestamp to Date if needed,
        // or handle as Timestamp. For client-side rendering, toDate() is often useful.
        createdAt: (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toDate() : new Date(data.createdAt),
      } as Order;
    });
    return orders;
  } catch (error) {
    console.error("Error fetching orders for user:", userId, error);
    // It's good practice to check Firestore console for missing index errors here.
    if ((error as any).code === 'failed-precondition') {
        console.error(
          `Firestore Precondition Failed: This often means you're missing an index. 
          Please create a composite index in Firestore for the 'orders' collection with:
          - 'userId' (Ascending or Descending)
          - 'createdAt' (Descending)`
        );
      }
    return [];
  }
}

