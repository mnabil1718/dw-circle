import { Router } from "express";
import authRoutes from "./auth.js";
import threadRoutes from "./thread.js";
import likeRoutes from "./like.js";
import userRoutes from "./user.js";
import followRoutes from "./follow.js";
import searchRoutes from "./search.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/threads", threadRoutes);
router.use("/likes", likeRoutes);
router.use("/users", userRoutes);
router.use("/follows", followRoutes);
router.use("/search", searchRoutes);
router.use("/healthcheck", (req, res) => { res.status(200).json({ status: "operational" }) })
export default router;
