import { type CreateUser, type FollowResponse, type RawFollowersResponse, type RawFollowingResponse, type RawFollowToggleResponse, type RawProfileResponse, type RawSearchUserResponse, type RawUnfollowResponse, type RawUserSuggestion, type ToggleFollowResponse, type UpdateProfile, type UpdateProfileResponse } from "../types/users.js";
import { type UserModel } from "../generated/prisma/models/User.js"
import { prisma } from "../lib/prisma/client.js";
import { USER_ROLE } from "../generated/prisma/enums.js";
import { InvariantError, NotFoundError } from "../utils/errors.js";
import { deleteCache, getCache, setCache } from "../utils/cache.js";


export async function createUser(req: CreateUser): Promise<UserModel> {
    return await prisma.user.create({
        data: {
            username: req.user_name,
            full_name: req.name,
            email: req.email,
            password: req.password,
            role: USER_ROLE.USER,
        }
    });
}

export async function getUserByIdentifier(identifier: string): Promise<UserModel> {
    const u = await prisma.user.findFirst({
        where: {
            OR: [
                { username: identifier },
                { email: identifier },
            ],
        },
    });

    if (!u) throw new InvariantError("invalid credentials");
    return u;
}


export async function getUserById(id: number): Promise<UserModel> {
    const u = await prisma.user.findFirst({
        where: {
            id,
        },
    });

    if (!u) throw new NotFoundError("user not found");
    return u;
}


export async function checkUserIDExists(id: number): Promise<void> {
    const u = await prisma.user.findUnique({
        where: {
            id
        },
    });

    if (!u) throw new NotFoundError("User not found");
}


export async function updateUserProfile(req: UpdateProfile): Promise<RawProfileResponse> {
    await deleteCache("threads:*");

    return await prisma.user.update({
        where: {
            id: req.userId,
        },
        data: {
            full_name: req.name,
            username: req.username,
            bio: req.bio ?? null,
            photo_profile: req.image,
        },
        include: {
            _count: {
                select: {
                    followers: true,
                    following: true,
                }
            }
        }
    });

}


export async function getUserProfile(userId: number): Promise<RawProfileResponse> {


    const res = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            _count: {
                select: {
                    followers: true,
                    following: true,
                }
            }
        }
    });

    if (!res) throw new NotFoundError("User not found");


    return res;
}


export async function getUserProfileByUsername(username: string, userId: number): Promise<RawProfileResponse> {


    const res = await prisma.user.findUnique({
        where: {
            username,
            NOT: {
                id: userId,
            },
        },
        include: {
            _count: {
                select: {
                    followers: true,
                    following: true,
                }
            },
        }
    });

    if (!res) throw new NotFoundError("User not found");


    return res;
}



export async function getFollowingByUserId(id: number): Promise<RawFollowingResponse[]> {
    const rows = await prisma.following.findMany({
        where: {
            follower_id: id,
        },
        include: {
            following: true,
        },
    });

    return rows;
}

export async function getFollowersByUserId(id: number): Promise<RawFollowersResponse[]> {
    const rows = await prisma.following.findMany({
        where: {
            following_id: id,
        },
        include: {
            follower: {
                select: {
                    id: true,
                    username: true,
                    full_name: true,
                    photo_profile: true,
                    bio: true,

                    followers: {
                        where: {
                            follower_id: id,
                        },
                    },
                },
            },
        },
    });

    return rows;
}


export async function checkIsFollowed(followingId: number, followerId: number): Promise<boolean> {
    const res = await prisma.following.findUnique({
        where: {
            follower_id_following_id: {
                following_id: followingId,
                follower_id: followerId,
            },
        },
    });

    if (!res) return false;

    return true;
}


export async function follow(followingId: number, followerId: number): Promise<RawFollowToggleResponse> {

    return await prisma.following.create({
        data: {
            following_id: followingId,
            follower_id: followerId,
        },
        include: {
            following: {
                include: {
                    _count: {
                        select: {
                            followers: true,
                            following: true,
                        }
                    }
                }
            },
            follower: {
                include: {
                    _count: {
                        select: {
                            followers: true,
                            following: true,
                        }
                    }
                }
            },
        },
    });
}


export async function unfollow(followingId: number, followerId: number): Promise<RawUnfollowResponse> {

    // cannot get num of followers and following
    // on delete, create transaction instead
    const [deleteFollowResult, followerUser, followingUser] = await prisma.$transaction([
        // delete
        prisma.following.delete({
            where: {
                follower_id_following_id: {
                    follower_id: followerId,
                    following_id: followingId,
                },
            },
        }),

        // get follower profile
        prisma.user.findUnique({
            where: {
                id: followerId,
            },
            include: {
                _count: {
                    select: {
                        followers: true,
                        following: true,
                    },
                },
            },
        }),

        // get following profile
        prisma.user.findUnique({
            where: {
                id: followingId,
            },
            include: {
                _count: {
                    select: {
                        followers: true,
                        following: true,
                    },
                },
            },
        }),

    ]);

    return {
        deleteResult: deleteFollowResult,
        followerUser: followerUser!,
        followingUser: followingUser!,
    };

}

export async function suggestUsersToFollow(id: number, limit: number): Promise<RawUserSuggestion[]> {
    return prisma.user.findMany({
        where: {
            NOT: {
                id,
            },
        },
        include: {
            followers: {
                where: {
                    follower_id: id,
                },
            },
        },
        take: limit,
    });
}


// for displaying is_followed on other user profile page
export async function getActiveUserFollow(id: number, username: string): Promise<RawUserSuggestion> {
    const res = await prisma.user.findUnique({
        where: {
            NOT: {
                id,
            },
            username,
        },
        include: {
            followers: {
                where: {
                    follower_id: id,
                },
            },
        },
    });

    if (!res) throw new NotFoundError("User not found");

    return res;
}



export async function searchUser(q: string, userId: number): Promise<RawSearchUserResponse[]> {
    return prisma.user.findMany({
        where: {
            AND: [
                {
                    id: {
                        not: userId,
                    },
                },
            ],
            OR: [
                {
                    username: {
                        contains: q,
                        mode: "insensitive",
                    },
                },
                {
                    full_name: {
                        contains: q,
                        mode: "insensitive",
                    },
                },
            ],
        },
        include: {
            followers: {
                where: {
                    follower_id: userId,
                },
            },
        },
    });
}
