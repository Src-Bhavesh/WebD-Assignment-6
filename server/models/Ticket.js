import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  ticketCode: { type: String, unique: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  category: { type: String, required: true, trim: true },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  description: { type: String, required: true, trim: true, maxlength: 3000 },
  screenshotUrl: { type: String, trim: true, default: "" },
  status: { type: String, enum: ["Open", "In Progress", "Resolved", "Closed"], default: "Open" },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", default: null },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  reopenedOnce: { type: Boolean, default: false },
  resolvedAt: { type: Date, default: null },
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true, trim: true, maxlength: 1500 },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

ticketSchema.pre("save", async function () {
  if (this.isNew && !this.ticketCode) {
    const nextNum = await mongoose.model("Ticket").countDocuments() + 1024;
    this.ticketCode = `TKT-${nextNum}`;
  }
});

export default mongoose.model("Ticket", ticketSchema);
