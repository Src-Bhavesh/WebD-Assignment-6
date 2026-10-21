import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function makeLogin(user) {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  return {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ message: "Name, email and password are needed." });
    if (password.length < 8) return res.status(400).json({ message: "Use at least 8 characters for your password." });
    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(409).json({ message: "An account with this email already exists." });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
    res.status(201).json(makeLogin(user));
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase().trim() });
    if (!user || !await bcrypt.compare(password || "", user.password)) {
      return res.status(401).json({ message: "Email or password is not correct." });
    }
    res.json(makeLogin(user));
  } catch (err) { next(err); }
}

export function getMe(req, res) {
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } });
}
