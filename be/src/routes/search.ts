import { Router } from "express";
import { validateQuery } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/authenticate.js";
import { SearchUserFilterSchema } from "../types/users.js";
import { getSearchUsers } from "../controllers/users.js";

const router = Router();
router.get("/", authenticate, validateQuery(SearchUserFilterSchema), getSearchUsers);

export default router;
