import { Router } from "express";
import authRoutes from "./auth.js";
import threadRoutes from "./thread.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/threads", threadRoutes);
export default router;
