import z from "zod";

export const CreateLikeSchema = z.object({
    user_id: z.number().int().gte(1),
    tweet_id: z.number().int().gte(1),
});

export type CreateLike = z.infer<typeof CreateLikeSchema>;

export const CreateReplyLikeSchema = z.object({
    user_id: z.number().int().gte(1),
    reply_id: z.number().int().gte(1),
});

export type CreateReplyLike = z.infer<typeof CreateReplyLikeSchema>;


export type ToggleLikeResponse = {
    thread_id: number;
    user_id: number;
    likes: number;
}


export type ToggleReplyLikeResponse = {
    reply_id: number;
    user_id: number;
    likes: number;
}
