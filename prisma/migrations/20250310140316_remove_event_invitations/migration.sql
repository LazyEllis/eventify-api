/*
  Warnings:

  - You are about to drop the `EventInvitation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventInvitation" DROP CONSTRAINT "EventInvitation_eventId_fkey";

-- DropTable
DROP TABLE "EventInvitation";

-- DropEnum
DROP TYPE "InvitationStatus";
