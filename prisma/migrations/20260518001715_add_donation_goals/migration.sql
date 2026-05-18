/*
  Warnings:

  - You are about to drop the column `isAnonymous` on the `donations` table. All the data in the column will be lost.
  - Added the required column `goalId` to the `donations` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `donations` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "donations" DROP CONSTRAINT "donations_userId_fkey";

-- AlterTable
ALTER TABLE "donations" DROP COLUMN "isAnonymous",
ADD COLUMN     "goalId" TEXT NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- CreateTable
CREATE TABLE "donation_goals" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "targetAmount" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donation_goals_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "donation_goals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
