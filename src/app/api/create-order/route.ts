
// src/app/api/create-order/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth as adminAuth } from '@/lib/firebase'; // Assuming firebase.ts exports auth from 'firebase/auth'
// For server-side auth token verification, you'd typically use Firebase Admin SDK
// For simplicity in this mock, we'll trust the UID passed if any, or check basic auth header.
// A real implementation MUST verify the user's token.

import type { Order, CartItem, Address } from '@/lib/types';

interface OrderPayload {
  userId: string; // UID from Firebase Auth on the client
  items: CartItem[];
  totalAmount: number;
  shippingAddress: Omit<Address, "id" | "isDefault">;
}

// This is a placeholder for getting the authenticated user on the server.
// In a real app, you'd verify an ID token sent in the Authorization header.
async function getAuthenticatedUserId(request: NextRequest): Promise<string | null> {
  // Example: const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
  // if (!idToken) return null;
  // try {
  //   const decodedToken = await admin.auth().verifyIdToken(idToken); // Requires Firebase Admin SDK
  //   return decodedToken.uid;
  // } catch (error) {
  //   console.error("Error verifying ID token:", error);
  //   return null;
  // }
  // For this simulation, we will trust the userId sent in the payload
  // but a real app MUST NOT do this without server-side token verification.
  return null; 
}


export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as OrderPayload;

    if (!payload.userId || !payload.items || payload.items.length === 0 || !payload.shippingAddress || payload.totalAmount <= 0) {
      return NextResponse.json({ error: 'Missing required order information.' }, { status: 400 });
    }
    
    // In a real scenario, verify the user's authentication token here.
    // For now, we'll use the userId from the payload but acknowledge this is insecure without server-side validation.
    const userId = payload.userId; 
    // const serverVerifiedUserId = await getAuthenticatedUserId(request);
    // if (!serverVerifiedUserId) {
    //   return NextResponse.json({ error: 'Unauthorized. User token missing or invalid.' }, { status: 401 });
    // }
    // if (serverVerifiedUserId !== payload.userId) {
    //   return NextResponse.json({ error: 'Mismatched user ID.' }, { status: 403 });
    // }


    // Simulate payment processing (always successful for this mock)
    const mockPaymentTransactionId = `sim_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    const newOrder: Omit<Order, 'id'> = {
      userId: userId,
      items: payload.items,
      totalAmount: payload.totalAmount,
      shippingAddress: { // Ensure all fields of Address are present
        customerName: payload.shippingAddress.customerName,
        customerEmail: payload.shippingAddress.customerEmail,
        street: payload.shippingAddress.street,
        city: payload.shippingAddress.city,
        state: payload.shippingAddress.state,
        zip: payload.shippingAddress.zip,
        country: payload.shippingAddress.country,
      },
      status: 'Pending',
      createdAt: serverTimestamp() as any, // Cast to any to satisfy Timestamp type temporarily
      mockPaymentDetails: {
        transactionId: mockPaymentTransactionId,
      },
    };

    const ordersCollection = collection(db, 'orders');
    const docRef = await addDoc(ordersCollection, newOrder);

    // Ideally, also clear the user's cart here if stored server-side,
    // or instruct the client to clear it.

    return NextResponse.json({ message: 'Order created successfully!', orderId: docRef.id }, { status: 201 });

  } catch (error) {
    console.error('Error creating order:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: 'Failed to create order.', details: errorMessage }, { status: 500 });
  }
}

// Basic OPTIONS handler for CORS preflight if needed (though less common for same-origin API routes in Next.js)
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*', // Adjust for your actual origin in production
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
