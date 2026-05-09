import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName, contactName, email, phone, website, tier, message } = body;

    if (!companyName || !contactName || !email || !tier) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const application = await prisma.sponsorApplication.create({
      data: { companyName, contactName, email, phone, website, tier, message },
    });

    // notify admin
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: "admin@cosmaclub.org",
      subject: `New sponsor application — ${companyName}`,
      html: `<p><strong>${companyName}</strong> (${tier}) applied. Contact: ${email}</p>`,
    });

    return NextResponse.json({ id: application.id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const applications = await prisma.sponsorApplication.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(applications);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}