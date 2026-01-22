import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { success } from "../utils/response.js";
import { checkUserIDExists } from "../services/users/queries.js";
import { AuthorizationError } from "../utils/errors.js";
import { checkThreadIDExists } from "../services/threads/queries.js";
import { getSocketServer } from "../sockets/server.js";
import type { ToggleLikeResponse, ToggleReplyLikeResponse } from "../services/likes/types.js";
import { LIKE_REPLY_TOGGLED_EVENT, LIKE_THREAD_TOGGLED_EVENT } from "../constants/events.js";
import { checkReplyLikeExists, checkThreadLikeExists, createReplyLike, createThreadLike, deleteReplyLike, deleteThreadLike } from "../services/likes/queries.js";
import { checkReplyIDExists } from "../services/replies/queries.js";

export const postThreadLikes = async (req: Request, res: Response) => {
    const { sub } = (req as any).user;
    const { tweet_id, user_id } = req.body;
    const loggedInUserId = Number(sub);
    const threadId = Number(tweet_id);

    if (loggedInUserId !== Number(user_id)) throw new AuthorizationError("action is not allowed");

    await checkUserIDExists(loggedInUserId);
    await checkThreadIDExists(threadId);

    const exists = await checkThreadLikeExists(loggedInUserId, threadId);
    let result: ToggleLikeResponse;

    if (exists) {
        result = await deleteThreadLike(loggedInUserId, threadId);
    } else {
        result = await createThreadLike(loggedInUserId, threadId);
    }

    getSocketServer().emit(LIKE_THREAD_TOGGLED_EVENT, result);

    const code = StatusCodes.OK;
    res.status(code).json(success(code, "Tweet liked successfully", result));
}


export const postReplyLikes = async (req: Request, res: Response) => {
    const { sub } = (req as any).user;
    const { reply_id, user_id } = req.body;
    const loggedInUserId = Number(sub);
    const replyId = Number(reply_id);

    if (loggedInUserId !== Number(user_id)) throw new AuthorizationError("action is not allowed");

    await checkUserIDExists(loggedInUserId);
    await checkReplyIDExists(replyId);

    const exists = await checkReplyLikeExists(loggedInUserId, replyId);
    let result: ToggleReplyLikeResponse;

    if (exists) {
        result = await deleteReplyLike(loggedInUserId, replyId);
    } else {
        result = await createReplyLike(loggedInUserId, replyId);
    }

    getSocketServer().emit(LIKE_REPLY_TOGGLED_EVENT, result);

    const code = StatusCodes.OK;
    res.status(code).json(success(code, "Reply liked successfully", result));
}

