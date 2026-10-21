import { Router } from "express";
import { addDepartment, editDepartment, listDepartments, removeDepartment } from "../controllers/departmentController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = Router();
router.get("/", protect, listDepartments);
router.post("/", protect, adminOnly, addDepartment);
router.put("/:id", protect, adminOnly, editDepartment);
router.delete("/:id", protect, adminOnly, removeDepartment);
export default router;
