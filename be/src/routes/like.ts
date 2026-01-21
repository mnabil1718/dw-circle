import { Router } from "express";
import { postLikes } from "../controllers/likes.js";
import { validate } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/authenticate.js";
import { CreateLikeSchema } from "../services/likes/types.js";

const router = Router();
router.post("/", authenticate, validate(CreateLikeSchema), postLikes);
export default router;
