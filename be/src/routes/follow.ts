import { Router } from "express";
import { validate, validateQuery } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/authenticate.js";
import { getUsersActiveFollow, getUsersFollows, getUsersSuggestions, postUsersFollow } from "../controllers/users.js";
import { GetUserFollowsSchema, ToggleFollowSchema } from "../types/users.js";

const router = Router();
router.post("/", authenticate, validate(ToggleFollowSchema), postUsersFollow);
router.get("/", authenticate, validateQuery(GetUserFollowsSchema), getUsersFollows);
router.get("/suggestions", authenticate, getUsersSuggestions);
router.get("/username/:username", authenticate, getUsersActiveFollow);
export default router;
