
// src/app/api/submit-feedback/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { FeedbackFormPayload } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as FeedbackFormPayload;

    // Basic validation
    if (!payload.name || !payload.message || !payload.rating) {
      return NextResponse.json({ error: 'Missing required fields: name, message, or rating.' }, { status: 400 });
    }

    if (payload.rating < 1 || payload.rating > 5) {
        return NextResponse.json({ error: 'Rating must be between 1 and 5.' }, { status: 400 });
    }

    if (payload.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(payload.email)) {
        return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
      }
    }

    const submissionData = {
      name: payload.name,
      email: payload.email || null, // Store as null if not provided
      rating: payload.rating,
      message: payload.message,
      createdAt: serverTimestamp(),
      status: 'new', // e.g., 'new', 'approved', 'archived'
    };

    const submissionsCollection = collection(db, 'feedbackSubmissions');
    const docRef = await addDoc(submissionsCollection, submissionData);

    return NextResponse.json({ message: 'Feedback submitted successfully!', submissionId: docRef.id }, { status: 201 });

  } catch (error) {
    console.error('Error in /api/submit-feedback:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while processing the feedback.';
    return NextResponse.json({ error: 'Failed to submit feedback on server.', details: errorMessage }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*', 
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
