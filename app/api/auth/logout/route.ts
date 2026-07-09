import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("session")?.value;
    
    if (sessionCookie) {
      try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
        await adminAuth.revokeRefreshTokens(decodedClaims.sub);
      } catch (error) {
        console.warn("Could not verify or revoke session cookie:", error);
      }
    }
    
    const response = NextResponse.json({ success: true }, { status: 200 });
    
    response.cookies.delete("session");
    
    return response;
  } catch (error) {
    console.error("Logout route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
