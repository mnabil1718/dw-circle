import { type CreateUser, type UpdateProfile, type UpdateProfileResponse } from "./types.js";
import { type UserModel } from "../../generated/prisma/models/User.js"
import { prisma } from "../../lib/prisma/client.js";
import { USER_ROLE } from "../../generated/prisma/enums.js";
import { InvariantError, NotFoundError } from "../../utils/errors.js";


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


export async function checkUserIDExists(id: number): Promise<void> {
    const u = await prisma.user.findUnique({
        where: {
            id
        },
    });

    if (!u) throw new NotFoundError("User not found");
}


export async function updateUserProfile(req: UpdateProfile): Promise<UpdateProfileResponse> {
    const res = await prisma.user.update({
        where: {
            id: req.userId,
        },
        data: {
            full_name: req.name,
            username: req.username,
            bio: req.bio ?? null,
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

    return {
        id: res.id,
        name: res.full_name,
        username: res.username,
        bio: res.bio ?? undefined,
        avatar: res.photo_profile ?? undefined,
        followers: res._count.followers,
        following: res._count.following,
    };
}


export async function getUserProfile(userId: number): Promise<UpdateProfileResponse> {
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

    return {
        id: res.id,
        name: res.full_name,
        username: res.username,
        bio: res.bio ?? undefined,
        avatar: res.photo_profile ?? undefined,
        followers: res._count.followers,
        following: res._count.following,
    };
}

