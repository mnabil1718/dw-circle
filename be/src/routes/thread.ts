import { Router } from "express";
import { validate, validateQuery } from "../middlewares/validate.js";
import { CreateThreadSchema } from "../services/threads/types.js";
import { getThreads, postThreads } from "../controllers/threads.js";
import { authenticate } from "../middlewares/authenticate.js";
import { singleImageUploadMiddleware } from "../middlewares/upload.js";
import { FilterSchema } from "../utils/filters.js";

const router = Router();
router.get("/", authenticate, validateQuery(FilterSchema), getThreads);
// if send data via form data/multipart, make sure multer is before body validation
router.post("/", authenticate, singleImageUploadMiddleware, validate(CreateThreadSchema), postThreads);
export default router;
