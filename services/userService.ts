import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp, FieldValue } from "firebase/firestore";
import { db } from "../lib/firebase";
import { User } from "firebase/auth";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  pointsBalance: number;
  lifetimePoints: number;
  role: "user" | "admin";
  meteorGameHighScore: number;
  createdAt: FieldValue | Date;
  lastLoginAt: FieldValue | Date;
}

export async function syncUserProfile(user: User): Promise<void> {
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const newUser: Partial<UserProfile> = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split("@")[0] || null,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber || null,
      pointsBalance: 0,
      lifetimePoints: 0,
      role: "user",
      meteorGameHighScore: 0,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    };
    await setDoc(userRef, newUser);
  } else {
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp(),
    });
  }
}

export async function updateUserProfile(uid: string, data: Partial<Omit<UserProfile, "uid" | "createdAt" | "pointsBalance" | "lifetimePoints" | "role" | "meteorGameHighScore" | "lastLoginAt">>): Promise<void> {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, data);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) return null;
  return snapshot.data() as UserProfile;
}

export async function addPoints(uid: string, amount: number): Promise<void> {
  if (amount <= 0) return;
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    pointsBalance: increment(amount),
    lifetimePoints: increment(amount),
  });
}

export async function deductPoints(uid: string, amount: number): Promise<void> {
  if (amount <= 0) return;
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    pointsBalance: increment(-amount),
  });
}

export async function updateHighScore(uid: string, newScore: number): Promise<void> {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    const currentHigh = snapshot.data().meteorGameHighScore || 0;
    if (newScore > currentHigh) {
      await updateDoc(userRef, {
        meteorGameHighScore: newScore
      });
    }
  }
}
