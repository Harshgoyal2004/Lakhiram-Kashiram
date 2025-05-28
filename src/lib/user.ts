
import { doc, setDoc, serverTimestamp, getDoc, type Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User as AuthUser } from 'firebase/auth'; // Renamed to avoid conflict if UserProfile is also named User

// This interface can represent the structure of the document in Firestore.
// It's good practice to have this if you fetch and use this data directly.
export interface UserProfileDocument {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  // You can add other app-specific fields here like 'roles', 'preferences', etc.
}

/**
 * Creates or updates a user's profile in Firestore.
 * Sets 'createdAt' only when the document is first created.
 * Updates 'lastLoginAt' on every call.
 * @param authUser The Firebase Auth User object.
 */
export async function upsertUserProfile(authUser: AuthUser): Promise<void> {
  if (!authUser) {
    console.warn("upsertUserProfile called with no authUser.");
    return;
  }

  const userDocRef = doc(db, 'users', authUser.uid);

  // Data to be set or merged
  const profileData = {
    uid: authUser.uid,
    email: authUser.email,
    displayName: authUser.displayName,
    photoURL: authUser.photoURL,
    lastLoginAt: serverTimestamp(), // Firestore will convert this to a server-side Timestamp
  };

  try {
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      // Document does not exist, create it with createdAt
      await setDoc(userDocRef, {
        ...profileData,
        createdAt: serverTimestamp(), // Set createdAt only on initial creation
      });
      console.log(`Created user profile for UID: ${authUser.uid}`);
    } else {
      // Document exists, update it (merge to only update specified fields)
      await setDoc(userDocRef, profileData, { merge: true });
      console.log(`Updated user profile for UID: ${authUser.uid}`);
    }
  } catch (error) {
    console.error("Error upserting user profile to Firestore for UID:", authUser.uid, error);
    // Optionally re-throw or handle as needed for your application's error strategy
  }
}
