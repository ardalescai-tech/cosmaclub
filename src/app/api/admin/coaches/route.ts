import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const coaches = await prisma.coach.findMany({
    include: {
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(coaches);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userEmail, bio, qualification, specialisms, pricePerHour } = await req.json();

    if (!userEmail || !pricePerHour) {
      return NextResponse.json({ error: "userEmail and pricePerHour are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return NextResponse.json({ error: "No user found with that email" }, { status: 404 });
    }

    const existing = await prisma.coach.findUnique({ where: { userId: user.id } });
    if (existing) {
      return NextResponse.json({ error: "This user already has a coach profile" }, { status: 400 });
    }

    const coach = await prisma.coach.create({
      data: {
        userId: user.id,
        bio: bio || null,
        qualification: qualification || null,
        specialisms: specialisms || [],
        pricePerHour: parseFloat(pricePerHour),
      },
    });

    // Upgrade user role to COACH
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "COACH" },
    });

    return NextResponse.json(coach, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}