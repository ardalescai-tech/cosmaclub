import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function calculateElo(winnerElo: number, loserElo: number) {
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action, scoreChallenger, scoreOpponent } = await req.json();

    const match = await prisma.match.findUnique({
      where: { id },
      include: { challenger: true, opponent: true },
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    if (action === "accept") {
      const updated = await prisma.match.update({
        where: { id },
        data: { status: "ACCEPTED" },
      });
      return NextResponse.json(updated);
    }

    if (action === "decline") {
      const updated = await prisma.match.update({
        where: { id },
        data: { status: "DECLINED" },
      });
      return NextResponse.json(updated);
    }

    if (action === "complete") {
      if (scoreChallenger === undefined || scoreOpponent === undefined) {
        return NextResponse.json({ error: "Scores required" }, { status: 400 });
      }

      const challengerWon = scoreChallenger > scoreOpponent;
      const elo = calculateElo(
        challengerWon ? match.challenger.elo : match.opponent.elo,
        challengerWon ? match.opponent.elo : match.challenger.elo
      );

      if (challengerWon) {
        await prisma.player.update({
          where: { id: match.challengerId },
          data: { elo: elo.winnerNew, wins: { increment: 1 } },
        });
        await prisma.player.update({
          where: { id: match.opponentId },
          data: { elo: elo.loserNew, losses: { increment: 1 } },
        });
      } else {
        await prisma.player.update({
          where: { id: match.opponentId },
          data: { elo: elo.winnerNew, wins: { increment: 1 } },
        });
        await prisma.player.update({
          where: { id: match.challengerId },
          data: { elo: elo.loserNew, losses: { increment: 1 } },
        });
      }

      const updated = await prisma.match.update({
        where: { id },
        data: {
          status: "COMPLETED",
          scoreChallenger,
          scoreOpponent,
          eloChangeChal: challengerWon ? elo.winnerChange : elo.loserChange,
          eloChangeOpp: challengerWon ? elo.loserChange : elo.winnerChange,
        },
      });

      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}