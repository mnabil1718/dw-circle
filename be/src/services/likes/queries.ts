import { prisma } from "../../lib/prisma/client.js";

export async function createLike(userId: number, threadId: number): Promise<void> {
    await prisma.like.create({
        data: {
            thread_id: threadId,
            user_id: userId,
            created_by: userId,
            updated_by: userId,
        },
    });
}


export async function deleteLike(userId: number, threadId: number): Promise<void> {
    await prisma.like.delete({
        where: {
            user_id_thread_id: {
                user_id: userId,
                thread_id: threadId,
            },
        },
    });
}


export async function checkLikeExists(userId: number, threadId: number): Promise<boolean> {
    const e = await prisma.like.findUnique({
        where: {
            user_id_thread_id: {
                user_id: userId,
                thread_id: threadId,
            }
        },
    });


    if (!e) return false;

    return true;
}
