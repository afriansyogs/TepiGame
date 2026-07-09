import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  try {
    const base64Key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!base64Key) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not set in environment variables.");
    }
    
    const serviceAccount = JSON.parse(Buffer.from(base64Key, "base64").toString("utf-8"));
    
    initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
  }
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();
