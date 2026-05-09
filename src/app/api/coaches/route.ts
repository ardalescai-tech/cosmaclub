import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const coaches = await prisma.coach.findMany({
      where: { isActive: true },
      include: {
        user: {
          select: { name: true, email: true, image: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(coaches);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const coach = await prisma.coach.create({ data: body });
    return NextResponse.json(coach, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}