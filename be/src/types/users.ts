import z from "zod";
import type { FollowingGetPayload, FollowingModel, UserGetPayload } from "../generated/prisma/models.js";

export const passwordSchema = z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(15, { message: "Password must be at most 15 characters" })
    .regex(/[a-z]/, { message: "Password must contain a lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain an uppercase letter" })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain a special character" });

export const LoginUserSchema = z.object({
    identifier: z.string().min(1), // username
    password: z.string(),
});

export const RegisterUserSchema = z.object({
    email: z.email(),
    user_name: z.string().min(1).max(60),
    name: z.string().min(1).max(60),
    password: passwordSchema,
});


export type CreateUser = z.infer<typeof RegisterUserSchema>;

export type RegisterUserResponse = {
    user_id: number;
    username: string;
    name: string;
    email: string;
}

export type LoginUserResponse = {
    user_id: number;
    username: string;
    name: string;
    email: string;
    avatar: string | undefined;
    token: string;
}


export const UpdateProfileSchema = z.object({
    name: z.string().min(1),
    username: z.string().min(1),
    bio: z.string().max(200).optional(),
});

export type UpdateProfile = z.infer<typeof UpdateProfileSchema> & {
    userId: number;
    image: string | null;
};


export type RawProfileResponse = UserGetPayload<{
    include: {
        _count: {
            select: {
                followers: true;
                following: true;
            };
        };
    };
}
>;

export type RawFollowingResponse = FollowingGetPayload<{
    include: {
        following: true;
    };
}>;


export type RawFollowersResponse = FollowingGetPayload<{
    include: {
        follower: {
            select: {
                id: true,
                username: true,
                full_name: true,
                photo_profile: true,
                bio: true,

                followers: true;
            };
        };
    };
}>;



export type UpdateProfileResponse = {
    id: number;
    name: string;
    username: string;
    avatar: string | undefined;
    bio: string | undefined;
    following: number;
    followers: number;
}

export type FollowResponse = {
    id: number;
    name: string;
    username: string;
    bio: string | undefined;
    avatar: string | undefined;
    is_followed: boolean;
}

export const GetUserFollowsSchema = z.object({
    type: z.literal(["followers", "following"]),
});

export type GetUserFollowsType = z.infer<typeof GetUserFollowsSchema>;

export const ToggleFollowSchema = z.object({
    following_id: z.number().int().gte(1),
});

export type ToggleFollow = z.infer<typeof ToggleFollowSchema>;

export type ToggleUser = {
    id: number;
    name: string;
    username: string;
    bio: string | undefined;
    avatar: string | undefined;
    following: number;
    followers: number;
};

export type ToggleFollowResponse = {
    following_id: number;
    follower_id: number;
    following: ToggleUser;
    follower: ToggleUser;
};


export type RawUserSuggestion = UserGetPayload<{
    include: {
        followers: true;
    };
}>;

export type RawFollowToggleResponse = FollowingGetPayload<{
    include: {
        follower: {
            include: {
                _count: {
                    select: {
                        followers: true,
                        following: true,
                    }
                }
            }
        };
        following: {
            include: {
                _count: {
                    select: {
                        followers: true,
                        following: true,
                    }
                }
            }
        };
    };
}>;



export type FollowToggledSocketType = "follow" | "unfollow";

// from user profile
export type FollowToggledSocketMetadata = {
    user_id: number;
    following: number;
    followers: number;
}

export type FollowToggledSocketPayload = {
    type: FollowToggledSocketType;
    result: ToggleFollowResponse;
}


export type RawUnfollowResponse = {
    deleteResult: FollowingModel;
    followerUser: UserGetPayload<{
        include: {
            _count: {
                select: {
                    followers: true,
                    following: true,
                },
            },
        },
    }>;
    followingUser: UserGetPayload<{
        include: {
            _count: {
                select: {
                    followers: true,
                    following: true,
                },
            },
        },
    }>;
}

export type RawSearchUserResponse = UserGetPayload<{
    include: {
        followers: true,
    },
}>;


export const SearchUserFilterSchema = z.object({
    keyword: z.string().optional(),
});

export type SearchUserFilter = z.infer<typeof SearchUserFilterSchema>;

