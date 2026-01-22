/*
  Warnings:

  - A unique constraint covering the columns `[user_id,reply_id]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_thread_id_fkey";

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "reply_id" INTEGER,
ALTER COLUMN "thread_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Like_user_id_reply_id_key" ON "Like"("user_id", "reply_id");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "Thread"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_reply_id_fkey" FOREIGN KEY ("reply_id") REFERENCES "Reply"("id") ON DELETE SET NULL ON UPDATE CASCADE;
