import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const {
      firstName, lastName, email, phone,
      dateOfBirth, address, city, postcode,
      emergencyName, emergencyPhone,
      memberType, playingLevel, heardAboutUs,
      medicalNotes, termsAccepted,
    } = await req.json();

    if (!firstName || !lastName || !email || !termsAccepted) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    // Creează sau găsește userul
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: `${firstName} ${lastName}`,
          phone: phone || null,
          role: "MEMBER",
        },
      });
    }

    // Creează profilul de membru
    const existing = await prisma.memberProfile.findUnique({ where: { userId: user.id } });
    if (existing) {
      return NextResponse.json({ error: "A profile already exists for this email." }, { status: 400 });
    }

    await prisma.memberProfile.create({
      data: {
        userId: user.id,
        firstName,
        lastName,
        phone: phone || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        address: address || null,
        city: city || null,
        postcode: postcode || null,
        emergencyName: emergencyName || null,
        emergencyPhone: emergencyPhone || null,
        memberType: memberType || "ADULT",
        playingLevel: playingLevel || "BEGINNER",
        heardAboutUs: heardAboutUs || null,
        medicalNotes: medicalNotes || null,
        termsAccepted: true,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}