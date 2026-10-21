import { Router } from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = Router();
router.get("/", protect, adminOnly, getDashboard);
export default router;
