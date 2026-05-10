import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ELO calculation function
function calculateElo(winnerElo: number, loserElo: number): { winnerNew: number; loserNew: number; winnerChange: number; loserChange: number } {
  const K = 32;
  const expectedWinner = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
  const expectedLoser = 1 / (1 + Math.pow(10, (winnerElo - loserElo) / 400));

  const winnerNew = Math.round(winnerElo + K * (1 - expectedWinner));
  const loserNew = Math.round(loserElo + K * (0 - expectedLoser));

  return {
    winnerNew,
    loserNew,
    winnerChange: winnerNew - winnerElo,
    loserChange: loserNew - loserElo,
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const playerId = searchParams.get("playerId");

    const matches = await prisma.match.findMany({
      where: playerId
        ? { OR: [{ challengerId: playerId }, { opponentId: playerId }] }
        : undefined,
      include: {
        challenger: true,
        opponent: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(matches);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { challengerId, opponentId, sessionDate } = await req.json();

    if (!challengerId || !opponentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ensure both players exist
    await prisma.player.upsert({
      where: { userId: challengerId },
      update: {},
      create: { userId: challengerId, elo: 1000 },
    });

    await prisma.player.upsert({
      where: { userId: opponentId },
      update: {},
      create: { userId: opponentId, elo: 1000 },
    });

    const challenger = await prisma.player.findUnique({ where: { userId: challengerId } });
    const opponent = await prisma.player.findUnique({ where: { userId: opponentId } });

    if (!challenger || !opponent) {
      return NextResponse.json({ error: "Players not found" }, { status: 404 });
    }

    const match = await prisma.match.create({
      data: {
        challengerId: challenger.id,
        opponentId: opponent.id,
        sessionDate: sessionDate ? new Date(sessionDate) : null,
        status: "PENDING",
      },
    });

    return NextResponse.json(match, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}