import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .substring(0, 80);
}

export async function GET() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "OWNER"].includes(session.user.role as string)) {
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
  if (!session?.user || !["ADMIN", "OWNER"].includes(session.user.role as string)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, excerpt, content, imageUrl, category, competitionId, published } = body;

    if (!title?.trim() || !excerpt?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "Title, excerpt and content are required." }, { status: 400 });
    }

    // Generate unique slug
    let slug = generateSlug(title);
    const existing = await prisma.newsPost.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const post = await prisma.newsPost.create({
      data: {
        title: title.trim(),
        slug,
        excerpt: excerpt.trim(),
        content: content.trim(),
        imageUrl: imageUrl || null,
        category: category || "GENERAL",
        competitionId: competitionId || null,
        published: published ?? false,
        publishedAt: published ? new Date() : null,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "OWNER"].includes(session.user.role as string)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, published, ...rest } = body;

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const post = await prisma.newsPost.update({
      where: { id },
      data: {
        ...rest,
        published,
        publishedAt: published ? new Date() : null,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "OWNER"].includes(session.user.role as string)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.newsPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}