import { threadId } from "node:worker_threads";
import { prisma } from "../../lib/prisma/client.js";
import { NotFoundError } from "../../utils/errors.js";
import { buildFilterQuery, type FilterType } from "../../utils/filters.js";
import type { CreateReply, CreateReplyResponse, RawReplyResponse } from "./types.js";

export async function createReply(req: CreateReply): Promise<CreateReplyResponse> {

    const [raw, replies] = await prisma.$transaction([

        prisma.reply.create({
            data: {
                content: req.content,
                thread_id: req.threadId,
                user_id: req.userId,
                image: req.image,
                created_by: req.userId,
                updated_by: req.userId,
            },
            include: {
                creator: true,
                _count: {
                    select: {
                        likes: true,
                    },
                },
            },
        }),

        prisma.reply.count({
            where: {
                thread_id: req.threadId,
            },
        }),
    ]);

    return {
        raw,
        thread: {
            id: req.threadId,
            replies,
        },
    };
}



export async function getAllReplies(thread_id: number, user_id: number, filter: FilterType): Promise<RawReplyResponse[]> {
    const limits = buildFilterQuery(filter);
    return await prisma.reply.findMany({
        where: {
            thread_id,
        },
        include: {
            creator: true,
            _count: {
                select: {
                    likes: true,
                }
            },
            likes: {
                where: {
                    user_id,
                },
                select: {
                    user_id: true,
                },
            },
        },
        orderBy: {
            created_at: "desc",
        },
        ...limits
    });
}


export async function checkReplyIDExists(id: number): Promise<void> {
    const r = await prisma.reply.findUnique({
        where: {
            id,
        },
    });

    if (!r) throw new NotFoundError("reply not found");
}

