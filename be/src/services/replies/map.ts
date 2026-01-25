import { STATIC_UPLOAD_PREFIX } from "../../constants/upload.js";
import type { RawCreateReplyResponse, RawReplyResponse, ReplyResponse } from "./types.js";

export class ReplyMapper {
    static createToResponse(raw: RawCreateReplyResponse): ReplyResponse {
        return {
            id: raw.id,
            thread_id: raw.thread_id,
            image: raw.image ? `${STATIC_UPLOAD_PREFIX}${raw.image}` : undefined, // prisma always returns null, not undefined
            content: raw.content,
            created_at: raw.created_at,
            likes: raw._count.likes,
            user: {
                id: raw.creator.id,
                name: raw.creator.full_name,
                username: raw.creator.username,
                profile_picture: raw.creator.photo_profile ? `${STATIC_UPLOAD_PREFIX}${raw.creator.photo_profile}` : undefined,
            },
            isLiked: false,
        };
    }


    static toResponses(arr: RawReplyResponse[]): ReplyResponse[] {
        return arr.map((t) => {
            return {
                id: t.id,
                thread_id: t.thread_id,
                image: t.image ? `${STATIC_UPLOAD_PREFIX}${t.image}` : undefined, // prisma always returns null, not undefined
                content: t.content,
                created_at: t.created_at,
                likes: t._count.likes,
                user: {
                    id: t.creator.id,
                    name: t.creator.full_name,
                    username: t.creator.username,
                    profile_picture: t.creator.photo_profile ? `${STATIC_UPLOAD_PREFIX}${t.creator.photo_profile}` : undefined,
                },
                isLiked: t.likes.length > 0,
            };
        });
    }
}

