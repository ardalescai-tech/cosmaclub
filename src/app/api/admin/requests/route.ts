import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session?.user || !["ADMIN", "OWNER"].includes(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requests = await prisma.roleRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  return NextResponse.json(requests);
}