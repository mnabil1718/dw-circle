import type { CreateThread } from "./types.js";
import { type ThreadModel } from "../../generated/prisma/models/Thread.js"
import { prisma } from "../../lib/prisma/client.js";

export async function createThread(data: CreateThread): Promise<ThreadModel> {
    return await prisma.thread.create({
        data: {
            content: data.content,
            created_by: data.userId,
            updated_by: data.userId,
            image: data.image,
        },
    });
}


export async function getAllThread(): Promise<ThreadModel[]> {
    return await prisma.thread.findMany({
        include: {
            creator: true,
            _count: {
                select: {
                    replies: true,
                }
            }
        }
    });
}
