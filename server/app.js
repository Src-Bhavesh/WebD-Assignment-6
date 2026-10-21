import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { errorHandler, notFound } from "./middleware/errors.js";

const app = express();
const allowedSites = (process.env.CLIENT_URL || "http://localhost:5173").split(",");
app.use(cors({ origin: allowedSites, credentials: true }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ message: "Helpdesk is ready." }));
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5050;
connectDb().then(() => app.listen(port, () => console.log(`Server is running on port ${port}`)))
  .catch((err) => { console.error("Could not connect to MongoDB:", err.message); process.exit(1); });
