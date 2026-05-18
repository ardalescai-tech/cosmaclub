import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "OWNER"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const goals = await prisma.donationGoal.findMany({
      orderBy: { createdAt: "desc" },
      include: { donations: { select: { amount: true } } },
    });

    const goalsWithRaised = goals.map((goal) => ({
      id: goal.id,
      title: goal.title,
      description: goal.description,
      category: goal.category,
      targetAmount: goal.targetAmount,
      isActive: goal.isActive,
      raised: goal.donations.reduce((sum, d) => sum + d.amount, 0),
    }));

    return NextResponse.json(goalsWithRaised);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "OWNER"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, description, category, targetAmount } = await req.json();
    if (!title?.trim() || !targetAmount) {
      return NextResponse.json({ error: "Title and target amount are required." }, { status: 400 });
    }
    const goal = await prisma.donationGoal.create({
      data: { title: title.trim(), description: description || null, category: category || null, targetAmount: parseFloat(targetAmount) },
    });
    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "OWNER"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, isActive } = await req.json();
    const goal = await prisma.donationGoal.update({ where: { id }, data: { isActive } });
    return NextResponse.json(goal);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update goal" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "OWNER"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await prisma.donationGoal.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete goal" }, { status: 500 });
  }
}