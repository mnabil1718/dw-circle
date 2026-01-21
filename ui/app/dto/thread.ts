import z from "zod";

export const THREAD_CHAR_LIMIT = 300;

export type Thread = {
    id: number;
    content: string;
    user: {
        id: number;
        username: string;
        name: string;
        profile_picture?: string;
    },
    created_at: string;
    likes: number;
    reply: number;
    isLiked: boolean;
}

export type CreateThreadResponse = {
    id: number;
    user_id: number;
    content: string;
    image_url?: string;
    timestamp: string;
}

export const ThreadImageSchema = z.file().max(3 * 1024 * 1024, "image cannot exceeds 3 MB").mime(["image/jpeg", "image/png", "image/webp"]).optional();

export const CreateThreadSchema = z.object({
    content: z.string().min(1, "Post cannot be empty").max(THREAD_CHAR_LIMIT, `Post cannot exceeds ${THREAD_CHAR_LIMIT} characters`),
    image: ThreadImageSchema,
});

export type CreateThreadDTO = z.infer<typeof CreateThreadSchema>;

