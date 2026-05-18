-- DropForeignKey
ALTER TABLE "donations" DROP CONSTRAINT "donations_goalId_fkey";

-- DropForeignKey
ALTER TABLE "donations" DROP CONSTRAINT "donations_userId_fkey";

-- AlterTable
ALTER TABLE "donations" ADD COLUMN     "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "goalId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "donation_goals"("id") ON DELETE SET NULL ON UPDATE CASCADE;
