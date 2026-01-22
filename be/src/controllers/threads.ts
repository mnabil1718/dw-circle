import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { success } from "../utils/response.js";
import type { CreateThread, RawCreateThreadResponse, RawThreadResponse } from "../services/threads/types.js";
import { createThread, getAllThread, getThreadById } from "../services/threads/queries.js";
import { ThreadMapper } from "../services/threads/map.js";
import { FilterSchema, type FilterType } from "../utils/filters.js";
import { getSocketServer } from "../sockets/server.js";
import { REPLY_CREATED_EVENT, THREAD_CREATED_EVENT } from "../constants/events.js";
import type { CreateReplyResponse, RawCreateReplyResponse, RawReplyResponse } from "../services/replies/types.js";
import { createReply, getAllReplies } from "../services/replies/queries.js";
import { ReplyMapper } from "../services/replies/map.js";

export const postThreads = async (req: Request, res: Response) => {
    const { sub } = (req as any).user;
    const { content } = req.body;
    const img = req.file;

    const data: CreateThread = {
        content,
        userId: Number(sub),
        image: img?.filename ?? null,
    }

    const raw: RawCreateThreadResponse = await createThread(data);
    const tweet = ThreadMapper.createToResponse(raw);
    const code = StatusCodes.CREATED;

    getSocketServer().emit(THREAD_CREATED_EVENT, { tweet });

    res.status(code).json(success(code, "Thread berhasil diposting.", { tweet }));
}


export const getThreads = async (req: Request, res: Response) => {
    const { sub } = (req as any).user;
    const filter: FilterType = FilterSchema.parse(req.query);

    const raw: RawThreadResponse[] = await getAllThread(Number(sub), filter);

    const threads = ThreadMapper.toResponses(raw);
    const code = StatusCodes.OK;
    res.status(code).json(success(code, "Get Data Thread Successfully", { threads }));
}


export const getThreadsById = async (req: Request, res: Response) => {
    const { sub } = (req as any).user;
    const { id } = req.params;

    const raw: RawThreadResponse = await getThreadById(Number(id), Number(sub));

    const thread = ThreadMapper.toResponse(raw);
    const code = StatusCodes.OK;
    res.status(code).json(success(code, "Get Data Thread Successfully", { thread }));
}

export const postReplyThread = async (req: Request, res: Response) => {
    const { sub } = (req as any).user;
    const { content } = req.body;
    const { id } = req.params;
    const img = req.file;

    const resp: CreateReplyResponse = await createReply({
        content,
        threadId: Number(id),
        userId: Number(sub),
        image: img?.filename ?? null,
    });

    const reply = ReplyMapper.createToResponse(resp.raw);
    const code = StatusCodes.CREATED;

    getSocketServer().emit(REPLY_CREATED_EVENT, { reply, metadata: resp.thread });

    res.status(code).json(success(code, "Reply berhasil diposting.", { reply, metadata: resp.thread }));
}


export const getReplies = async (req: Request, res: Response) => {
    const { sub } = (req as any).user;
    const { id } = req.params; // thread id
    const filter: FilterType = FilterSchema.parse(req.query);

    const raw: RawReplyResponse[] = await getAllReplies(Number(id), Number(sub), filter);

    const replies = ReplyMapper.toResponses(raw);
    const code = StatusCodes.OK;
    res.status(code).json(success(code, "Get Data Replies Successfully", { replies }));
}





