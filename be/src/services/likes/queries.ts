import { prisma } from "../../lib/prisma/client.js";
import type { ToggleLikeResponse } from "./types.js";

export async function createLike(userId: number, threadId: number): Promise<ToggleLikeResponse> {
    const [_, likes] = await prisma.$transaction([

        prisma.like.create({
            data: {
                thread_id: threadId,
                user_id: userId,
                created_by: userId,
                updated_by: userId,
            },
        }),

        prisma.like.count({
            where: {
                thread_id: threadId,
            },
        }),
    ]);

    return {
        thread_id: threadId,
        user_id: userId,
        likes,
    };
}


export async function deleteLike(userId: number, threadId: number): Promise<ToggleLikeResponse> {

    const [_, likes] = await prisma.$transaction([
        prisma.like.delete({
            where: {
                user_id_thread_id: {
                    user_id: userId,
                    thread_id: threadId,
                },
            },
        }),

        prisma.like.count({
            where: {
                thread_id: threadId,
            },
        }),
    ]);


    return {
        user_id: userId,
        thread_id: threadId,
        likes,
    };
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
