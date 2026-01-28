import type { CreateThread, RawCreateThreadResponse, RawThreadResponse } from "../types/threads.js";
import { prisma } from "../lib/prisma/client.js";
import { buildFilterQuery, type FilterType } from "../utils/filters.js";
import { deleteCache, getCache, setCache } from "../utils/cache.js";
import { NotFoundError } from "../utils/errors.js";

export async function createThread(data: CreateThread): Promise<RawCreateThreadResponse> {
    const res = await prisma.thread.create({
        data: {
            content: data.content,
            created_by: data.userId,
            updated_by: data.userId,
            image: data.image,
        },
        include: {
            creator: true,
            _count: {
                select: {
                    replies: true,
                    likes: true,
                },
            },
        },
    });

    await deleteCache("threads:*"); // invalidate on write

    return res;
}


export async function getAllThread(user_id: number, filter: FilterType): Promise<RawThreadResponse[]> {
    const limits = buildFilterQuery(filter);
    const ownerId = filter.userId; // optional scoping for profile
    let cacheKey: string;

    if (!ownerId) {
        cacheKey = `threads:user:${ownerId}:${JSON.stringify(filter)}`;
    }

    cacheKey = `threads:all:${JSON.stringify(filter)}`;

    const cached = await getCache<RawThreadResponse[]>(cacheKey);
    if (cached && cached.length > 0) {
        return cached;
    }


    const res = await prisma.thread.findMany({
        where: {
            ...(ownerId && {
                created_by: ownerId,
            }),
        },
        include: {
            creator: true,
            _count: {
                select: {
                    replies: true,
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

    await setCache(cacheKey, res, 60);

    return res;
}

export async function getThreadById(id: number, userId: number): Promise<RawThreadResponse> {
    const t = await prisma.thread.findUnique({
        where: {
            id,
        },
        include: {
            creator: true,
            _count: {
                select: {
                    replies: true,
                    likes: true,
                }
            },
            likes: {
                where: {
                    user_id: userId,
                },
                select: {
                    user_id: true,
                },
            },
        },
    });

    if (!t) throw new NotFoundError("Thread not found");

    const cacheKey = `threads:single:${t.id}`;
    await setCache(cacheKey, t);

    return t;
}


export async function checkThreadIDExists(id: number): Promise<void> {
    const t = await prisma.thread.findUnique({
        where: {
            id
        },
    });

    if (!t) throw new NotFoundError("Thread not found");
}

