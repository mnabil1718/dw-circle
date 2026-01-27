import { redis } from "../lib/redis/redis.js";



export async function getCache<T>(key: string): Promise<T | null> {
    const val = await redis.get(key);
    if (val) {
        return JSON.parse(val);
    }

    return null;
}

export async function setCache(key: string, value: unknown, ttl = 1800): Promise<void> {
    await redis.set(key, JSON.stringify(value), {
        EX: ttl,
    });
}

export async function deleteCache(key: string): Promise<void> {
    await redis.del(key);
}


