import { Router } from "express";
import authRoutes from "./auth.js";
import threadRoutes from "./thread.js";
import likeRoutes from "./like.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/threads", threadRoutes);
router.use("/likes", likeRoutes);
export default router;
