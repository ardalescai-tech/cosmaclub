import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const {
      firstName, lastName, email, phone,
      dateOfBirth, address, city, postcode,
      emergencyName, emergencyPhone,
      playingLevel, heardAboutUs, medicalNotes,
      termsAccepted, registrationType,
      qualification, experience, bio, requestMessage,
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

    // Creează profilul de membru dacă nu există
    const existing = await prisma.memberProfile.findUnique({ where: { userId: user.id } });
    if (!existing) {
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
          memberType: registrationType === "COACH" ? "COACH" : registrationType === "CAPTAIN" ? "ADULT" : "ADULT",
          playingLevel: playingLevel || "BEGINNER",
          heardAboutUs: heardAboutUs || null,
          medicalNotes: medicalNotes || null,
          termsAccepted: true,
        },
      });
    }

    // Coach sau Captain — creează RoleRequest
    if (registrationType === "COACH" || registrationType === "CAPTAIN") {
      const requestedRole = registrationType === "COACH" ? "COACH" : "CAPTAIN";

      const existingRequest = await prisma.roleRequest.findFirst({
        where: { userId: user.id, requestedRole, status: "PENDING" },
      });

      if (!existingRequest) {
        await prisma.roleRequest.create({
          data: {
            userId: user.id,
            requestedRole,
            message: [
              bio ? `Bio: ${bio}` : null,
              qualification ? `Qualification: ${qualification}` : null,
              experience ? `Experience: ${experience} years` : null,
              requestMessage ? `Message: ${requestMessage}` : null,
            ].filter(Boolean).join("\n") || null,
          },
        });
      }
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}