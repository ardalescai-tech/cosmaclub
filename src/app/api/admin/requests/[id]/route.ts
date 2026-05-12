import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session?.user || !["ADMIN", "OWNER"].includes(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { action } = await req.json();

    const request = await prisma.roleRequest.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (action === "approve") {
      // Updatează rolul userului
      await prisma.user.update({
        where: { id: request.userId },
        data: { role: request.requestedRole as any },
      });

      await prisma.roleRequest.update({
        where: { id },
        data: { status: "APPROVED", reviewedAt: new Date() },
      });
    } else if (action === "reject") {
      await prisma.roleRequest.update({
        where: { id },
        data: { status: "REJECTED", reviewedAt: new Date() },
      });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}