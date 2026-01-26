import { Router } from "express";
import { validate, validateQuery } from "../middlewares/validate.js";
import { CreateThreadSchema } from "../types/threads.js";
import { getReplies, getThreads, getThreadsById, postReplyThread, postThreads } from "../controllers/threads.js";
import { authenticate } from "../middlewares/authenticate.js";
import { singleImageUploadMiddleware } from "../middlewares/upload.js";
import { CreateReplySchema } from "../types/replies.js";
import { FilterSchema } from "../utils/filters.js";

const router = Router();
router.get("/", authenticate, validateQuery(FilterSchema), getThreads);
// if send data via form data/multipart, make sure multer is before body validation
router.post("/", authenticate, singleImageUploadMiddleware, validate(CreateThreadSchema), postThreads);
router.get("/:id", authenticate, getThreadsById);
router.get("/:id/replies", authenticate, validateQuery(FilterSchema), getReplies);
router.post("/:id/replies", authenticate, singleImageUploadMiddleware, validate(CreateReplySchema), postReplyThread);
export default router;
