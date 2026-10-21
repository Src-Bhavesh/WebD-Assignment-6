import Department from "../models/Department.js";
import Ticket from "../models/Ticket.js";

export async function listDepartments(req, res, next) {
  try { res.json(await Department.find().sort("name")); } catch (err) { next(err); }
}

export async function addDepartment(req, res, next) {
  try {
    if (!req.body.name?.trim()) return res.status(400).json({ message: "Please add a department name." });
    const department = await Department.create({ name: req.body.name, description: req.body.description || "" });
    res.status(201).json(department);
  } catch (err) { next(err); }
}

export async function editDepartment(req, res, next) {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, {
      name: req.body.name, description: req.body.description || ""
    }, { new: true, runValidators: true });
    if (!department) return res.status(404).json({ message: "Department was not found." });
    res.json(department);
  } catch (err) { next(err); }
}

export async function removeDepartment(req, res, next) {
  try {
    const used = await Ticket.exists({ department: req.params.id });
    if (used) return res.status(409).json({ message: "Move its tickets before removing this department." });
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) return res.status(404).json({ message: "Department was not found." });
    res.json({ message: "Department removed." });
  } catch (err) { next(err); }
}
