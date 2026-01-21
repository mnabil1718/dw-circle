import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { success } from "../utils/response.js";
import type { CreateThread, RawThreadResponse } from "../services/threads/types.js";
import { createThread, getAllThread } from "../services/threads/queries.js";
import { ThreadMapper } from "../services/threads/map.js";
import { FilterSchema, type FilterType } from "../utils/filters.js";
import { getSocketServer } from "../sockets/server.js";
import { THREAD_CREATED_EVENT } from "../sockets/constants.js";

export const postThreads = async (req: Request, res: Response) => {
    const { sub } = (req as any).user;
    const { content } = req.body;
    const img = req.file;

    const data: CreateThread = {
        content,
        userId: Number(sub),
        image: img?.filename ?? null,
    }

    const raw: RawThreadResponse = await createThread(data);
    const tweet = ThreadMapper.toResponse(raw);
    const code = StatusCodes.CREATED;

    getSocketServer().emit(THREAD_CREATED_EVENT, { tweet });

    res.status(code).json(success(code, "Thread berhasil diposting.", { tweet }));
}


export const getThreads = async (req: Request, res: Response) => {
    // const { sub } = (req as any).user;
    const filter: FilterType = FilterSchema.parse(req.query);

    const raw: RawThreadResponse[] = await getAllThread(filter);
    const threads = ThreadMapper.toResponses(raw);
    const code = StatusCodes.OK;
    res.status(code).json(success(code, "Get Data Thread Successfully", { threads }));
}

