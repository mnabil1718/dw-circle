import z from "zod";
import type { UserGetPayload } from "../../generated/prisma/models.js";

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
    avatar?: string;
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

export type UpdateProfileResponse = {
    id: number;
    name: string;
    username: string;
    avatar: string | undefined;
    bio: string | undefined;
    following: number;
    followers: number;
}
