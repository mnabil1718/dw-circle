-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
