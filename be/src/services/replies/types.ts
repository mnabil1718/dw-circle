import z from "zod";
import type { ReplyGetPayload } from "../../generated/prisma/models.js";
import type { Author } from "../threads/types.js";

export const CreateReplySchema = z.object({
    content: z.string().min(1).max(300),
});

export type CreateReply = z.infer<typeof CreateReplySchema> & {
    image: string | null; // prisma expects null, not undefined
    userId: number;
    threadId: number;
};


export type RawCreateReplyResponse = ReplyGetPayload<{
    include: {
        creator: true;
        _count: {
            select: {
                likes: true;
            };
        };
    };
}>;

export type ThreadMetadata = {
    id: number;
    replies: number;
};

export type CreateResponse = {
    raw: RawCreateReplyResponse;
    thread: ThreadMetadata;
};


export type RawReplyResponse = ReplyGetPayload<{
    include: {
        creator: true;
        _count: {
            select: {
                likes: true;
            };
        };
        likes: {
            select: {
                user_id: true,
            },
        },
    };
}>;


export type ReplyResponse = {
    id: number;
    content: string;
    thread_id: number;
    image: string | undefined;
    user: Author;
    created_at: Date;
    likes: number;
    isLiked: boolean;
};

