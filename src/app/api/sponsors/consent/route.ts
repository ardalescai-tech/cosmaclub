import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, analytics, marketing } = await req.json();
    const userAgent = req.headers.get("user-agent") ?? undefined;

    await prisma.cookieConsent.create({
      data: {
        sessionId: sessionId ?? null,
        essential: true,
        analytics: !!analytics,
        marketing: !!marketing,
        userAgent,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}