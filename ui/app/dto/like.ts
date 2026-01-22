export type AddLikeDTO = {
    tweet_id: number;
    user_id: number;
}

export type AddReplyLikeDTO = {
    reply_id: number;
    user_id: number;
}

export type ToggleLikeResponse = {
    thread_id: number;
    user_id: number;
    likes: number;
}