import type { Request, Response } from "express";
import type { UserModel } from "../generated/prisma/models.js";
import { createUser, getUserByIdentifier } from "../services/users/queries.js";
import { Hasher } from "../utils/hasher.js";
import { StatusCodes } from "http-status-codes";
import { success } from "../utils/response.js";
import { generateJWT } from "../utils/tokenize.js";
import type { LoginUserResponse, RegisterUserResponse } from "../services/users/types.js";

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
    };

    const code = StatusCodes.OK;

    res.status(code).json(success(code, "Login successful", response));
}
