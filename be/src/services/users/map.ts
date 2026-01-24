import { STATIC_UPLOAD_PREFIX } from "../../constants/upload.js";
import type { RawProfileResponse, UpdateProfileResponse } from "./types.js";

export class UserMapper {
    static toProfileResponse(res: RawProfileResponse): UpdateProfileResponse {
        return {
            id: res.id,
            name: res.full_name,
            username: res.username,
            bio: res.bio ?? undefined,
            avatar: res.photo_profile ? `${STATIC_UPLOAD_PREFIX}${res.photo_profile}` : undefined,
            followers: res._count.followers,
            following: res._count.following,
        };
    }
}
