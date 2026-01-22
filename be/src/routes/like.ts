import { Router } from "express";
import { postReplyLikes, postThreadLikes } from "../controllers/likes.js";
import { validate } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/authenticate.js";
import { CreateLikeSchema, CreateReplyLikeSchema } from "../services/likes/types.js";

const router = Router();
router.post("/", authenticate, validate(CreateLikeSchema), postThreadLikes);
router.post("/replies", authenticate, validate(CreateReplyLikeSchema), postReplyLikes);
export default router;
