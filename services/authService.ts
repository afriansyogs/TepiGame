import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebase";

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

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error: unknown) {
    throw new Error(getAuthErrorMessage(error));
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: unknown) {
    throw new Error(getAuthErrorMessage(error));
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: unknown) {
    throw new Error(getAuthErrorMessage(error));
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error: unknown) {
    throw new Error(getAuthErrorMessage(error));
  }
};
