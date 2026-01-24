import z from "zod";

export const PROFILE_CHAR_LIMIT = 200;

export type UserProfile = {
    id: number;
    name: string;
    username: string;
    avatar?: string;
    bio?: string;
    following: number;
    followers: number;
    optimistic?: boolean;
};

export const ProfileImageSchema = z.file().max(3 * 1024 * 1024, "image cannot exceeds 3 MB").mime(["image/jpeg", "image/png", "image/webp"]).optional();

export const UpdateProfileSchema = z.object({
    name: z.string().min(1, "minimum 1 character"),
    username: z.string().min(1, "minimum 1 character"),
    bio: z.string().max(PROFILE_CHAR_LIMIT, `bio cannot exceeds ${PROFILE_CHAR_LIMIT} characters`).optional(),
    image: ProfileImageSchema,
});

export type UpdateProfileSchemaType = z.infer<typeof UpdateProfileSchema>;

export type UpdateProfileDTO = z.infer<typeof UpdateProfileSchema> & {
    userId: number;
};
