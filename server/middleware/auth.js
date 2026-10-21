import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protect(req, res, next) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Please log in first." });
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(data.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "Your account was not found." });
    next();
  } catch (err) {
    res.status(401).json({ message: "Your login has expired. Please log in again." });
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") return res.status(403).json({ message: "Admin access is needed for this page." });
  next();
}
