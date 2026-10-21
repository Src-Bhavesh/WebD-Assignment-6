import Ticket from "../models/Ticket.js";
import Department from "../models/Department.js";

const ticketInfo = "customer department assignedTo";

export async function createTicket(req, res, next) {
  try {
    const { title, category, priority, description, screenshotUrl } = req.body;
    if (!title?.trim() || !category?.trim() || !description?.trim()) return res.status(400).json({ message: "Title, category and details are required." });
    const ticket = await Ticket.create({ title, category, priority, description, screenshotUrl, customer: req.user._id });
    res.status(201).json(await ticket.populate(ticketInfo));
  } catch (err) { next(err); }
}

export async function myTickets(req, res, next) {
  try {
    const tickets = await Ticket.find({ customer: req.user._id }).populate(ticketInfo).sort({ updatedAt: -1 });
    res.json(tickets);
  } catch (err) { next(err); }
}

export async function allTickets(req, res, next) {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.category) filter.category = req.query.category;
    const search = req.query.search?.trim();
    if (search) filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { ticketCode: { $regex: search, $options: "i" } }
    ];
    res.json(await Ticket.find(filter).populate(ticketInfo).sort({ updatedAt: -1 }));
  } catch (err) { next(err); }
}

export async function getTicket(req, res, next) {
  try {
    const ticket = await Ticket.findById(req.params.id).populate(ticketInfo).populate("comments.user", "name role");
    if (!ticket) return res.status(404).json({ message: "Ticket was not found." });
    if (req.user.role !== "admin" && ticket.customer._id.toString() !== req.user._id.toString()) return res.status(403).json({ message: "This ticket belongs to another customer." });
    res.json(ticket);
  } catch (err) { next(err); }
}

export async function editTicket(req, res, next) {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket was not found." });
    if (ticket.customer.toString() !== req.user._id.toString()) return res.status(403).json({ message: "You can only change your own tickets." });
    if (ticket.status !== "Open") return res.status(400).json({ message: "Only open tickets can be edited." });
    for (const key of ["title", "category", "priority", "description", "screenshotUrl"]) {
      if (req.body[key] !== undefined) ticket[key] = req.body[key];
    }
    await ticket.save();
    res.json(await ticket.populate(ticketInfo));
  } catch (err) { next(err); }
}

export async function deleteTicket(req, res, next) {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket was not found." });
    if (ticket.customer.toString() !== req.user._id.toString()) return res.status(403).json({ message: "You can only remove your own tickets." });
    if (ticket.status !== "Open") return res.status(400).json({ message: "Only open tickets can be removed." });
    await ticket.deleteOne();
    res.json({ message: "Ticket removed." });
  } catch (err) { next(err); }
}

export async function addComment(req, res, next) {
  try {
    if (!req.body.message?.trim()) return res.status(400).json({ message: "Write a reply before sending." });
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket was not found." });
    if (req.user.role !== "admin" && ticket.customer.toString() !== req.user._id.toString()) return res.status(403).json({ message: "This ticket belongs to another customer." });
    if (ticket.status === "Closed") return res.status(400).json({ message: "Closed tickets are read-only." });
    ticket.comments.push({ user: req.user._id, message: req.body.message });
    await ticket.save();
    res.status(201).json(await ticket.populate("comments.user", "name role"));
  } catch (err) { next(err); }
}

export async function setTicketStatus(req, res, next) {
  try {
    const { status } = req.body;
    const allowed = ["Open", "In Progress", "Resolved", "Closed"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Choose a valid ticket status." });
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket was not found." });
    if (ticket.status === "Closed") return res.status(400).json({ message: "Closed tickets cannot be changed." });
    if (status === "Open" && ticket.status === "Resolved") {
      if (ticket.reopenedOnce) return res.status(400).json({ message: "This ticket has already been reopened once." });
      ticket.reopenedOnce = true;
    } else {
      const nextSteps = {
        "Open": ["In Progress"],
        "In Progress": ["Resolved"],
        "Resolved": ["Closed"]
      };
      if (!nextSteps[ticket.status]?.includes(status)) return res.status(400).json({ message: "That status change is not allowed." });
    }
    ticket.status = status;
    ticket.resolvedAt = status === "Resolved" ? new Date() : null;
    await ticket.save();
    res.json(await ticket.populate(ticketInfo));
  } catch (err) { next(err); }
}

export async function assignTicket(req, res, next) {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket was not found." });
    if (ticket.status === "Closed") return res.status(400).json({ message: "Closed tickets cannot be assigned." });
    if (req.body.departmentId) {
      const department = await Department.findById(req.body.departmentId);
      if (!department) return res.status(404).json({ message: "Department was not found." });
      ticket.department = department._id;
    } else ticket.department = null;
    await ticket.save();
    res.json(await ticket.populate(ticketInfo));
  } catch (err) { next(err); }
}

export async function reopenTicket(req, res, next) {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket was not found." });
    if (ticket.customer.toString() !== req.user._id.toString()) return res.status(403).json({ message: "You can only reopen your own ticket." });
    if (ticket.status !== "Resolved") return res.status(400).json({ message: "Only resolved tickets can be reopened." });
    if (ticket.reopenedOnce) return res.status(400).json({ message: "This ticket has already been reopened once." });
    ticket.status = "Open";
    ticket.reopenedOnce = true;
    ticket.resolvedAt = null;
    await ticket.save();
    res.json(await ticket.populate(ticketInfo));
  } catch (err) { next(err); }
}
