import { Router } from "express";
import { LoginUserSchema, RegisterUserSchema } from "../services/users/types.js";
import { validate } from "../middlewares/validate.js";
import { postLogin, postUsers } from "../controllers/users.js";

const router = Router();
router.post("/register", validate(RegisterUserSchema), postUsers);
router.post("/login", validate(LoginUserSchema), postLogin);
export default router;
