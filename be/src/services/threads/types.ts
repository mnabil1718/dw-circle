import { z } from "zod";
import type { ThreadGetPayload } from "../../generated/prisma/models.js";

export const CreateThreadSchema = z.object({
    content: z.string().min(1).max(300),
});

export type CreateThread = z.infer<typeof CreateThreadSchema> & {
    image: string | null; // prisma expects null, not undefined
    userId: number;
};

export type CreateThreadResponse = Omit<CreateThread, "image"> & {
    id: number;
    image_url: string | undefined;
    timestamp: Date;
};


export type Author = {
    id: number;
    name: string;
    username: string;
    profile_picture: string | undefined;
}


export type RawThreadResponse = ThreadGetPayload<{
    include: {
        creator: true;
        _count: {
            select: {
                replies: true;
                likes: true;
            };
        };
    };
}>;


export type ThreadResponse = {
    id: number;
    content: string;
    image: string | undefined;
    user: Author;
    created_at: Date;
    likes: number;
    replies: number;
    isLiked: boolean;
}
