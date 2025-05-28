
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
    const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    return orders;
  } catch (error) {
    console.error("Error fetching orders for user:", userId, error);
    return [];
  }
}
