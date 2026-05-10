import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const players = await prisma.player.findMany({
      orderBy: { elo: "desc" },
    });

    const playersWithUsers = await Promise.all(
      players.map(async (player, index) => {
        const user = await prisma.user.findUnique({
          where: { id: player.userId },
          select: { name: true, email: true, image: true },
        });

        const totalMatches = player.wins + player.losses;
        const winRate = totalMatches > 0 ? Math.round((player.wins / totalMatches) * 100) : 0;

        return {
          rank: index + 1,
          id: player.id,
          userId: player.userId,
          name: user?.name ?? "Unknown",
          email: user?.email ?? "",
          image: user?.image ?? null,
          elo: player.elo,
          wins: player.wins,
          losses: player.losses,
          winRate,
        };
      })
    );

    return NextResponse.json(playersWithUsers);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}