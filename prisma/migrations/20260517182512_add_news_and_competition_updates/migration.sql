-- CreateEnum
CREATE TYPE "NewsCategory" AS ENUM ('GENERAL', 'COMPETITION', 'ANNOUNCEMENT', 'EVENT');

-- AlterTable
ALTER TABLE "competitions" ADD COLUMN     "categories" TEXT[],
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "prizes" TEXT,
ADD COLUMN     "sponsor" TEXT,
ALTER COLUMN "location" SET DEFAULT 'Braidhurst High School, Motherwell';

-- CreateTable
CREATE TABLE "news_posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "category" "NewsCategory" NOT NULL DEFAULT 'GENERAL',
    "competitionId" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "news_posts_slug_key" ON "news_posts"("slug");

-- AddForeignKey
ALTER TABLE "news_posts" ADD CONSTRAINT "news_posts_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "competitions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
