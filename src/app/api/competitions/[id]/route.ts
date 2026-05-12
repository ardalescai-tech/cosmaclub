import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const competition = await prisma.competition.findUnique({
      where: { id },
      include: { _count: { select: { registrations: true } } },
    });
    if (!competition) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(competition);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const competition = await prisma.competition.update({
      where: { id },
      data,
    });
    return NextResponse.json(competition);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}