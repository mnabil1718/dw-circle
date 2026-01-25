import { prisma } from "../lib/prisma/client.js";
import type { ToggleLikeResponse, ToggleReplyLikeResponse } from "../types/likes.js";

export async function createThreadLike(userId: number, threadId: number): Promise<ToggleLikeResponse> {
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


export async function deleteThreadLike(userId: number, threadId: number): Promise<ToggleLikeResponse> {

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


export async function checkThreadLikeExists(userId: number, threadId: number): Promise<boolean> {
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






export async function createReplyLike(userId: number, replyId: number): Promise<ToggleReplyLikeResponse> {
    const [_, likes] = await prisma.$transaction([

        prisma.like.create({
            data: {
                reply_id: replyId,
                user_id: userId,
                created_by: userId,
                updated_by: userId,
            },
        }),

        prisma.like.count({
            where: {
                reply_id: replyId,
            },
        }),
    ]);

    return {
        reply_id: replyId,
        user_id: userId,
        likes,
    };
}


export async function deleteReplyLike(userId: number, replyId: number): Promise<ToggleReplyLikeResponse> {

    const [_, likes] = await prisma.$transaction([
        prisma.like.delete({
            where: {
                user_id_reply_id: {
                    user_id: userId,
                    reply_id: replyId,
                },
            },
        }),

        prisma.like.count({
            where: {
                reply_id: replyId,
            },
        }),
    ]);


    return {
        user_id: userId,
        reply_id: replyId,
        likes,
    };
}


export async function checkReplyLikeExists(userId: number, replyId: number): Promise<boolean> {
    const e = await prisma.like.findUnique({
        where: {
            user_id_reply_id: {
                user_id: userId,
                reply_id: replyId,
            },
        },
    });


    if (!e) return false;

    return true;
}

