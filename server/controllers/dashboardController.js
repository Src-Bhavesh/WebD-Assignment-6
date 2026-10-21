import Ticket from "../models/Ticket.js";

export async function getDashboard(req, res, next) {
  try {
    const [total, open, resolved, priority, category, resolvedTickets] = await Promise.all([
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: { $in: ["Open", "In Progress"] } }),
      Ticket.countDocuments({ status: { $in: ["Resolved", "Closed"] } }),
      Ticket.aggregate([{ $group: { _id: "$priority", count: { $sum: 1 } } }]),
      Ticket.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Ticket.find({ resolvedAt: { $ne: null } }, "createdAt resolvedAt")
    ]);
    const times = resolvedTickets.map((ticket) => (ticket.resolvedAt - ticket.createdAt) / 3600000);
    const avgHours = times.length ? Math.round(times.reduce((sum, val) => sum + val, 0) / times.length) : 0;
    res.json({ total, open, resolved, avgHours, priority, category });
  } catch (err) { next(err); }
}
