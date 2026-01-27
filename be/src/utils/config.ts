import "dotenv/config";

export const config = {
    port: process.env.PORT ?? 8080,
    host: process.env.HOST ?? "http://localhost",
    frontend_url: process.env.FRONTEND_URL ?? "http://localhost:5173",
    db: {
        url: process.env.DATABASE_URL,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    redis: {
        url: process.env.REDIS_URL ?? "redis://localhost:6379",
    },
};
