import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const news = await prisma.newsPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      include: {
        competition: {
          select: { id: true, title: true, status: true },
        },
      },
    });
    return NextResponse.json(news);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}