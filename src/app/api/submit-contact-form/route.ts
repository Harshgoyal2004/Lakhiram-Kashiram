
// src/app/api/submit-contact-form/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ContactFormPayload } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as ContactFormPayload;

    // Basic validation
    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Validate email format (simple regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
    }

    const submissionData = {
      ...payload,
      createdAt: serverTimestamp(),
      status: 'new', // You can add a status field, e.g., 'new', 'read', 'archived'
    };

    const submissionsCollection = collection(db, 'contactSubmissions');
    const docRef = await addDoc(submissionsCollection, submissionData);

    return NextResponse.json({ message: 'Message submitted successfully!', submissionId: docRef.id }, { status: 201 });

  } catch (error) {
    console.error('Error submitting contact form:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: 'Failed to submit message.', details: errorMessage }, { status: 500 });
  }
}

// Basic OPTIONS handler for CORS preflight if needed
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
