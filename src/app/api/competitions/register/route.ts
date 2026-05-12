import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { competitionId, notes } = await req.json();

    const existing = await prisma.competitionRegistration.findUnique({
      where: {
        userId_competitionId: {
          userId: (session.user as any).id,
          competitionId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: "You are already registered for this competition." }, { status: 400 });
    }

    const registration = await prisma.competitionRegistration.create({
      data: {
        userId: (session.user as any).id,
        competitionId,
        notes: notes || null,
      },
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}