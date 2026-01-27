import { Router } from "express";
import { UpdateProfileSchema } from "../types/users.js";
import { validate } from "../middlewares/validate.js";
import { putUsersProfile, getUsersProfile, getUsersProfileByUsername } from "../controllers/users.js";
import { authenticate } from "../middlewares/authenticate.js";
import { singleImageUploadMiddleware } from "../middlewares/upload.js";

const router = Router();
router.get("/:id/profile", authenticate, getUsersProfile);
router.get("/:username/profile/username", authenticate, getUsersProfileByUsername);
router.put("/:id/profile", authenticate, singleImageUploadMiddleware, validate(UpdateProfileSchema), putUsersProfile);
export default router;
