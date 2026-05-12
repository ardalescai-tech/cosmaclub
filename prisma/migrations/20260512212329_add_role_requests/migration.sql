-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "role_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requestedRole" "Role" NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "role_requests" ADD CONSTRAINT "role_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
