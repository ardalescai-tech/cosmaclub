import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "OWNER"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        goal: { select: { title: true } },
      },
    });
    return NextResponse.json(donations);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 });
  }
}