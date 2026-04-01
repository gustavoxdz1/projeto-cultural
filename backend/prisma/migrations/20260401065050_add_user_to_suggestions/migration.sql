/*
  Warnings:

  - Added the required column `userId` to the `Suggestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Suggestion" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Suggestion" ADD CONSTRAINT "Suggestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
