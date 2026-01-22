import z from "zod";
import type { UserLoginResponse } from "./auth";

export type Reply = {
    id: number;
    content: string;
    thread_id: number;
    image?: string;
    user: {
        id: number;
        username: string;
        name: string;
        profile_picture?: string;
    },
    created_at: string;
    likes: number;
    replies: number;
    isLiked: boolean;
    optimistic?: boolean;
}

export type ReplyThreadMetadata = {
    id: number;
    replies: number;
}

export const THREAD_CHAR_LIMIT = 300;

export type CreateReplyResponse = {
    id: number;
    user_id: number;
    content: string;
    thread_id: number;
    image_url?: string;
    timestamp: string;
}

export const ReplyImageSchema = z.file().max(3 * 1024 * 1024, "image cannot exceeds 3 MB").mime(["image/jpeg", "image/png", "image/webp"]).optional();

export const CreateReplySchema = z.object({
    content: z.string().min(1, "Post cannot be empty").max(THREAD_CHAR_LIMIT, `Reply cannot exceeds ${THREAD_CHAR_LIMIT} characters`).transform(v => v.replace(/\r\n/g, "\n").trim()),
    image: ReplyImageSchema,
});

export type CreateReplyDTO = z.infer<typeof CreateReplySchema>;

export type CreateReplyActionPayload = {
    req: CreateReplyDTO,
    user: UserLoginResponse | null,
    threadId: number;
};
