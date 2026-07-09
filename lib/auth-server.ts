import { cookies } from "next/headers";
import { adminAuth, adminDb } from "./firebase-admin";

export interface ServerUser {
  uid: string;
  email?: string;
}

export interface ServerUserProfile {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  pointsBalance: number;
}

export async function getServerSession(): Promise<ServerUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
    };
  } catch (error) {
    return null;
  }
}

export async function getServerUserProfile(): Promise<ServerUserProfile | null> {
  const user = await getServerSession();
  
  if (!user) return null;

  try {
    const userDoc = await adminDb.collection("users").doc(user.uid).get();
    
    if (userDoc.exists) {
      const data = userDoc.data();
      return {
        uid: user.uid,
        displayName: data?.displayName || null,
        photoURL: data?.photoURL || null,
        pointsBalance: data?.pointsBalance || 0,
      };
    }
  } catch (error) {
    console.error("Failed to fetch user profile on server:", error);
  }

  return null;
}
