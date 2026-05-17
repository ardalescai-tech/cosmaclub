import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "OWNER"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const news = await prisma.newsPost.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        competition: { select: { id: true, title: true } },
      },
    });
    return NextResponse.json(news);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "OWNER"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    if (!data.title || !data.slug || !data.excerpt || !data.content) {
      return NextResponse.json(
        { error: "title, slug, excerpt, and content are required" },
        { status: 400 }
      );
    }

    if (data.published && !data.publishedAt) {
      data.publishedAt = new Date();
    }

    const post = await prisma.newsPost.create({ data });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
