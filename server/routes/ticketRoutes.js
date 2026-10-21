import { Router } from "express";
import {
  addComment, allTickets, assignTicket, createTicket, deleteTicket, editTicket,
  getTicket, myTickets, reopenTicket, setTicketStatus
} from "../controllers/ticketController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.post("/", createTicket);
router.get("/my", myTickets);
router.get("/", adminOnly, allTickets);
router.get("/:id", getTicket);
router.put("/:id", editTicket);
router.delete("/:id", deleteTicket);
router.post("/:id/comments", addComment);
router.patch("/:id/reopen", reopenTicket);
router.patch("/:id/status", adminOnly, setTicketStatus);
router.patch("/:id/assign", adminOnly, assignTicket);
export default router;
