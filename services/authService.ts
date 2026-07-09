import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebase";
import { syncUserProfile } from "./userService";

const getAuthErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Email atau password salah. Pastikan akun sudah terdaftar.";
      case "auth/email-already-in-use":
        return "Email ini sudah terdaftar. Silakan gunakan email lain atau login.";
      case "auth/weak-password":
        return "Password terlalu lemah, gunakan minimal 6 karakter.";
      case "auth/invalid-email":
        return "Format email tidak valid.";
      case "auth/popup-closed-by-user":
        return "Login dengan Google dibatalkan.";
      case "auth/network-request-failed":
        return "Koneksi internet bermasalah, silakan coba lagi.";
      default:
        return "Terjadi kesalahan saat otentikasi. Silakan coba lagi.";
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Terjadi kesalahan yang tidak diketahui.";
};

const setSessionCookie = async (user: User) => {
  const idToken = await user.getIdToken();
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken })
  });
  if (!response.ok) throw new Error("Gagal menginisialisasi sesi server.");
};

const clearSessionCookie = async () => {
  const response = await fetch("/api/auth/logout", { method: "POST" });
  if (!response.ok) console.warn("Failed to clear server session");
};

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    if (result.user) {
      await syncUserProfile(result.user);
      await setSessionCookie(result.user);
      return result.user;
    }
    return null;
  } catch (error: unknown) {
    throw new Error(getAuthErrorMessage(error));
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await syncUserProfile(result.user);
    await setSessionCookie(result.user);
    return result.user;
  } catch (error: unknown) {
    throw new Error(getAuthErrorMessage(error));
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await syncUserProfile(result.user);
    await setSessionCookie(result.user);
    return result.user;
  } catch (error: unknown) {
    throw new Error(getAuthErrorMessage(error));
  }
};

export const logOut = async () => {
  try {
    await clearSessionCookie();
    await signOut(auth);
  } catch (error: unknown) {
    throw new Error(getAuthErrorMessage(error));
  }
};
