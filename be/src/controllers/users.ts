import type { Request, Response } from "express";
import type { UserModel } from "../generated/prisma/models.js";
import { checkUserIDExists, createUser, getUserByIdentifier, updateUserProfile, getUserProfile, getUserById } from "../services/users/queries.js";
import { Hasher } from "../utils/hasher.js";
import { StatusCodes } from "http-status-codes";
import { success } from "../utils/response.js";
import { generateJWT } from "../utils/tokenize.js";
import type { LoginUserResponse, RegisterUserResponse, UpdateProfile } from "../services/users/types.js";
import { UserMapper } from "../services/users/map.js";
import { STATIC_UPLOAD_PREFIX } from "../constants/upload.js";

export const postUsers = async (req: Request, res: Response) => {

    req.body.password = await Hasher.hash(req.body.password);
    const u: UserModel = await createUser(req.body);
    const response: RegisterUserResponse = {
        user_id: u.id,
        username: u.username,
        name: u.full_name,
        email: u.email,
    };

    const code = StatusCodes.CREATED;
    res.status(code).json(success(code, "Registrasi berhasil. Akun berhasil dibuat.", response));
}


export const postLogin = async (req: Request, res: Response) => {

    const { identifier, password } = req.body;
    const u: UserModel = await getUserByIdentifier(identifier);
    await Hasher.compare(password, u.password);
    const accessToken: string = await generateJWT({ sub: String(u.id), role: u.role });

    const response: LoginUserResponse = {
        user_id: u.id,
        email: u.email,
        name: u.full_name,
        username: u.username,
        token: accessToken,
        avatar: u.photo_profile ? `${STATIC_UPLOAD_PREFIX}${u.photo_profile}` : undefined,
    };

    const code = StatusCodes.OK;

    res.status(code).json(success(code, "Login successful", response));
}



export const putUsersProfile = async (req: Request, res: Response) => {

    const { sub } = (req as any).user;
    const userId = Number(sub);

    const user = await getUserById(userId);

    const { name, username, bio } = req.body;
    const image = req.file;

    const data: UpdateProfile = {
        userId,
        name,
        username,
        bio: bio ?? null,
        image: image?.filename ?? user.photo_profile,
    };

    const raw = await updateUserProfile(data);
    const profile = UserMapper.toProfileResponse(raw);

    const code = StatusCodes.OK;
    res.status(code).json(success(code, "Profile berhasil diupdate", profile));
}


export const getUsersProfile = async (req: Request, res: Response) => {

    const { sub } = (req as any).user;
    const userId = Number(sub);

    const raw = await getUserProfile(userId);
    const profile = UserMapper.toProfileResponse(raw);

    const code = StatusCodes.OK;
    res.status(code).json(success(code, "Profile fetched successfully", profile));
}

