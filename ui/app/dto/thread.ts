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