import { createClient } from "redis";
import { config } from "../../utils/config.js";

export const redis = createClient({
    url: config.redis.url,
});

redis.on("error", (err) => {
    console.error("Redis error: ", err);
});

export async function initRedis() {
    if (!redis.isOpen) {
        await redis.connect();
        console.log("Redis connected...");
    }
}
