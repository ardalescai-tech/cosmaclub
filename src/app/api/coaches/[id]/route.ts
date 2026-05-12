import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const coach = await prisma.coach.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        availability: true,
      },
    });

    if (!coach) return NextResponse.json({ error: "Coach not found" }, { status: 404 });

    return NextResponse.json(coach);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}