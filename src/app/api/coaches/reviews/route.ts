import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const coachId = searchParams.get("coachId");

  if (!coachId) return NextResponse.json({ error: "coachId required" }, { status: 400 });

  const reviews = await prisma.coachReview.findMany({
    where: { coachId },
    include: {
      user: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { coachId, rating, comment } = await req.json();

    if (!coachId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const existing = await prisma.coachReview.findUnique({
      where: {
        userId_coachId: {
          userId: (session.user as any).id,
          coachId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: "You have already reviewed this coach." }, { status: 400 });
    }

    const review = await prisma.coachReview.create({
      data: {
        coachId,
        userId: (session.user as any).id,
        rating,
        comment: comment || null,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}