import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDb } from "./config/db.js";
import User from "./models/User.js";
import Department from "./models/Department.js";
import Ticket from "./models/Ticket.js";

await connectDb();
const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "ChangeThis123!", 10);
const admin = await User.findOneAndUpdate(
  { email: (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase() },
  { name: process.env.ADMIN_NAME || "Helpdesk Admin", email: (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase(), password: adminPassword, role: "admin" },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);
const customerPassword = await bcrypt.hash("Customer123!", 10);
const customer = await User.findOneAndUpdate(
  { email: "alex@example.com" },
  { name: "Alex Morgan", email: "alex@example.com", password: customerPassword, role: "customer" },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

const deptNames = ["Accounts", "Technical Support", "Orders", "General Help"];
const depts = [];
for (const name of deptNames) {
  depts.push(await Department.findOneAndUpdate({ name }, { name }, { upsert: true, new: true }));
}

const sampleInfo = [
  ["Can't sign in to my account", "Account", "High", "I reset my password but still cannot sign in."],
  ["Update the billing address", "Billing", "Low", "I moved and need to update my billing details."],
  ["Order status has not changed", "Orders", "Medium", "The tracking page has shown the same update for two days."],
  ["Page keeps loading", "Technical", "High", "The help page keeps loading when I open it."],
  ["Request a copy of my receipt", "Billing", "Low", "Could you send me a copy of last month's receipt?"],
  ["Change the email on my profile", "Account", "Medium", "I would like to use my new email address."],
  ["Return label is missing", "Orders", "High", "My package arrived but there was no return label."],
  ["Add a team member", "General", "Low", "Please help me add one more person to our account."],
  ["App closes after I log in", "Technical", "High", "The app closes right after the welcome screen."],
  ["Question about a recent charge", "Billing", "Medium", "I would like to understand a charge on my statement."]
];

if (await Ticket.countDocuments() === 0) {
  for (let i = 0; i < sampleInfo.length; i += 1) {
    const [title, category, priority, description] = sampleInfo[i];
    await Ticket.create({
      title, category, priority, description, customer,
      department: depts[i % depts.length]._id,
      status: i < 3 ? "Open" : i < 6 ? "In Progress" : i < 8 ? "Resolved" : "Closed",
      resolvedAt: i >= 6 ? new Date(Date.now() - (i + 2) * 3600000) : null
    });
  }
}

console.log("Seed data is ready.");
console.log(`Admin: ${admin.email} / ${process.env.ADMIN_PASSWORD || "ChangeThis123!"}`);
console.log("Customer: alex@example.com / Customer123!");
process.exit(0);
