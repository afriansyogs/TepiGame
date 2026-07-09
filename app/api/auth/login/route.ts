import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const idToken = body.idToken;

    if (!idToken) {
      return NextResponse.json({ error: "Missing ID token" }, { status: 400 });
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    if (new Date().getTime() / 1000 - decodedToken.auth_time < 5 * 60) {
      const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
      
      const response = NextResponse.json({ success: true }, { status: 200 });
      
      response.cookies.set("session", sessionCookie, {
        maxAge: expiresIn / 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
      });

      return response;
    } else {
      return NextResponse.json({ error: "Recent login required" }, { status: 401 });
    }
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
