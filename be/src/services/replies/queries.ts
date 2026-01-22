import { prisma } from "../../lib/prisma/client.js";

export async function getRepliesByThreadId(threadId: number): Promise<> {
    return await prisma.reply.findMany({
        where: {
            thread_id: threadId,
        },

    });
}
