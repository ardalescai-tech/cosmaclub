import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, userId, sessionDate, priceType, price } = await req.json();

    if (!sessionId || !userId || !sessionDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const session = await prisma.playSession.findUnique({ where: { id: sessionId } });
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const booking = await prisma.booking.create({
      data: {
        sessionId,
        userId,
        date: new Date(sessionDate),
        startTime: session.startTime,
        endTime: session.endTime,
        amount: price,
        notes: priceType ? `Price type: ${priceType}` : null,
        status: "CONFIRMED",
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const bookings = await prisma.booking.findMany({
      where: userId ? { userId } : undefined,
      include: { session: true, coach: { include: { user: true } } },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}