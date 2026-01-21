import type { ThreadModel } from "../../generated/prisma/models.js";
import { STATIC_UPLOAD_PREFIX } from "../../utils/constants.js";
import type { RawThreadResponse, ThreadResponse } from "./types.js";

export class ThreadMapper {
    static toResponse(raw: RawThreadResponse): ThreadResponse {
        return {
            id: raw.id,
            image: raw.image ? `${STATIC_UPLOAD_PREFIX}${raw.image}` : undefined, // prisma always returns null, not undefined
            content: raw.content,
            created_at: raw.created_at,
            replies: raw._count.replies,
            likes: raw._count.likes,
            user: {
                id: raw.creator.id,
                name: raw.creator.full_name,
                username: raw.creator.username,
                profile_picture: raw.creator.photo_profile ?? undefined,
            },
            isLiked: false,
        };
    }

    static toResponses(arr: RawThreadResponse[]): ThreadResponse[] {
        return arr.map((t) => {
            return {
                id: t.id,
                image: t.image ? `${STATIC_UPLOAD_PREFIX}${t.image}` : undefined, // prisma always returns null, not undefined
                content: t.content,
                created_at: t.created_at,
                replies: t._count.replies,
                likes: t._count.likes,
                user: {
                    id: t.creator.id,
                    name: t.creator.full_name,
                    username: t.creator.username,
                    profile_picture: t.creator.photo_profile ?? undefined,
                },
                isLiked: false,
            };
        });
    }
}
