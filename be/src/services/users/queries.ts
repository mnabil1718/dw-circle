import { type CreateUser } from "./types.js";
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
