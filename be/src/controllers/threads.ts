import type { Request, Response } from "express";
import type { ThreadModel } from "../generated/prisma/models.js";
import { createUser, getUserByIdentifier } from "../services/users/queries.js";
import { Hasher } from "../utils/hasher.js";
import { StatusCodes } from "http-status-codes";
import { success } from "../utils/response.js";
import { generateJWT } from "../utils/tokenize.js";
import type { LoginUserResponse, RegisterUserResponse } from "../services/users/types.js";
import type { CreateThread, CreateThreadResponse } from "../services/threads/types.js";
import { createThread, getAllThread } from "../services/threads/queries.js";

export const postThreads = async (req: Request, res: Response) => {
    const { sub } = (req as any).user;
    const { content } = req.body;
    const img = req.file;

    const data: CreateThread = {
        content,
        userId: Number(sub),
        image: img?.filename ?? null,
    }

    const t: ThreadModel = await createThread(data);
    const tweet: CreateThreadResponse = {
        id: t.id,
        userId: t.created_by,
        content: t.content,
        image_url: t.image ?? undefined,
        timestamp: t.created_at,
    };

    const code = StatusCodes.CREATED;
    res.status(code).json(success(code, "Thread berhasil diposting.", tweet));
}


export const getThreads = async (req: Request, res: Response) => {
    // const { sub } = (req as any).user;


    const threads: ThreadModel[] = await getAllThread();
    console.log(threads);

    const code = StatusCodes.OK;
    res.status(code).json(success(code, "Thread berhasil diposting.", undefined));
}

