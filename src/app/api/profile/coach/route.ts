import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const coach = await prisma.coach.findUnique({
      where: { userId: (session.user as any).id },
    });
    if (!coach) return NextResponse.json({ error: "Coach profile not found" }, { status: 404 });
    return NextResponse.json(coach);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { bio, qualification, specialisms, pricePerHour, phone, experience, instagram, twitter } = await req.json();

    const coach = await prisma.coach.update({
      where: { userId: (session.user as any).id },
      data: {
        bio: bio || null,
        qualification: qualification || null,
        specialisms: specialisms || [],
        pricePerHour: pricePerHour || 0,
        phone: phone || null,
        experience: experience || null,
        instagram: instagram || null,
        twitter: twitter || null,
      },
    });

    return NextResponse.json(coach);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}