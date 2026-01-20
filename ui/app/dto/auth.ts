import { z } from "zod";

export const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(15, "Password must be at most 15 characters")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[^a-zA-Z0-9]/, "Password must contain a special character");


export const registerFormSchema = z.object({
    user_name: z.string()
        .min(1, "Username must be atleast 1 characters")
        .max(60, "Username must be less than 60 characters"),
    name: z.string()
        .min(1, "Name must be atleast 1 characters")
        .max(60, "Name must be less than 60 characters"),
    password: passwordSchema,
    email: z.email(),
});

export const loginFormSchema = z.object({
    identifier: z.string()
        .min(1, "Username must be atleast 1 characters"),
    password: z.string(),
});

export type RegisterDTO = z.infer<typeof registerFormSchema>;
export type LoginDTO = z.infer<typeof loginFormSchema>;

export type UserLoginResponse = {
    user_id: number;
    username: string;
    name: string;
    email: string;
    avatar?: string;
    token: string;
}
