import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!["CAPTAIN", "ADMIN", "OWNER"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const matches = await prisma.match.findMany({
      where: { status: "ACCEPTED" },
      include: {
        challenger: true,
        opponent: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    // Fetch user names separately
    const enriched = await Promise.all(
      matches.map(async (match) => {
        const [chalUser, oppUser] = await Promise.all([
          prisma.user.findUnique({
            where: { id: match.challenger.userId },
            select: { name: true },
          }),
          prisma.user.findUnique({
            where: { id: match.opponent.userId },
            select: { name: true },
          }),
        ]);

        return {
          ...match,
          challenger: { ...match.challenger, user: chalUser },
          opponent: { ...match.opponent, user: oppUser },
        };
      })
    );

    return NextResponse.json(enriched);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}