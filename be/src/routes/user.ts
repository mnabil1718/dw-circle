import { Router } from "express";
import { UpdateProfileSchema } from "../services/users/types.js";
import { validate } from "../middlewares/validate.js";
import { putUsersProfile, getUsersProfile } from "../controllers/users.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();
router.get("/:id/profile", authenticate, getUsersProfile);
router.put("/:id/profile", authenticate, validate(UpdateProfileSchema), putUsersProfile);
export default router;
