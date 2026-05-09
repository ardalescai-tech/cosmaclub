import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const competitions = await prisma.competition.findMany({
      where: {
        status: { in: ["OPEN", "UPCOMING"] },
      },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: { startDate: "asc" },
    });
    return NextResponse.json(competitions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const competition = await prisma.competition.create({ data: body });
    return NextResponse.json(competition, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}