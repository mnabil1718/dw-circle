import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { success } from "../utils/response.js";
import { checkUserIDExists } from "../services/users/queries.js";
import { AuthorizationError } from "../utils/errors.js";
import { checkThreadIDExists } from "../services/threads/queries.js";
import { checkLikeExists, createLike, deleteLike } from "../services/likes/queries.js";

export const postLikes = async (req: Request, res: Response) => {
    const { sub } = (req as any).user;
    const { tweet_id, user_id } = req.body;
    const loggedInUserId = Number(sub);
    const threadId = Number(tweet_id);

    if (loggedInUserId !== Number(user_id)) throw new AuthorizationError("action is not allowed");

    await checkUserIDExists(loggedInUserId);
    await checkThreadIDExists(threadId);

    const exists = await checkLikeExists(loggedInUserId, threadId);

    if (exists) {
        await deleteLike(loggedInUserId, threadId);
    } else {
        await createLike(loggedInUserId, threadId);
    }
    const code = StatusCodes.OK;
    res.status(code).json(success(code, "Tweet liked successfully", undefined));
}
