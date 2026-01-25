import { id } from "zod/locales";
import { STATIC_UPLOAD_PREFIX } from "../constants/upload.js";
import type { FollowResponse, RawFollowersResponse, RawFollowingResponse, RawFollowToggleResponse, RawProfileResponse, RawUserSuggestion, ToggleFollowResponse, UpdateProfileResponse } from "../types/users.js";

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

    static toFollowingResponses(arr: RawFollowingResponse[]): FollowResponse[] {
        return arr.map((item) => {
            return {
                id: item.following_id,
                name: item.following.full_name,
                username: item.following.username,
                bio: item.following.bio ?? undefined,
                avatar: item.following.photo_profile ? `${STATIC_UPLOAD_PREFIX}${item.following.photo_profile}` : undefined,
                is_followed: true,
            };
        });
    }


    static toFollowerResponses(arr: RawFollowersResponse[]): FollowResponse[] {
        return arr.map((item) => {
            return {
                id: item.follower_id,
                name: item.follower.full_name,
                username: item.follower.username,
                bio: item.follower.bio ?? undefined,
                avatar: item.follower.photo_profile ? `${STATIC_UPLOAD_PREFIX}${item.follower.photo_profile}` : undefined,
                is_followed: item.follower.followers.length > 0,
            };
        });
    }


    static toSuggestionFollowerResponses(arr: RawUserSuggestion[]): FollowResponse[] {
        return arr.map((item) => {
            return {
                id: item.id,
                name: item.full_name,
                username: item.username,
                bio: item.bio ?? undefined,
                avatar: item.photo_profile ? `${STATIC_UPLOAD_PREFIX}${item.photo_profile}` : undefined,
                is_followed: item.followers.length > 0,
            };
        });
    }

    static toToggleResponse(raw: RawFollowToggleResponse): ToggleFollowResponse {
        return {
            following_id: raw.following_id,
            follower_id: raw.follower_id,
            follower: {
                id: raw.follower.id,
                name: raw.follower.full_name,
                username: raw.follower.username,
                bio: raw.follower.bio ?? undefined,
                avatar: raw.follower.photo_profile ? `${STATIC_UPLOAD_PREFIX}${raw.follower.photo_profile}` : undefined,
            },
            following: {
                id: raw.following.id,
                name: raw.following.full_name,
                username: raw.following.username,
                bio: raw.following.bio ?? undefined,
                avatar: raw.following.photo_profile ? `${STATIC_UPLOAD_PREFIX}${raw.following.photo_profile}` : undefined,
            }

        }
    }

}
