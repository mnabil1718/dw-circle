import z from "zod";

export const CreateLikeSchema = z.object({
    user_id: z.number().int().gte(1),
    tweet_id: z.number().int().gte(1),
});

export type CreateLike = z.infer<typeof CreateLikeSchema>;

export type ToggleLikeResponse = {
    thread_id: number;
    user_id: number;
    likes: number;
}
