export function notFound(req, res) {
  res.status(404).json({ message: "That page was not found." });
}

export function errorHandler(err, req, res, next) {
  if (err.code === 11000) return res.status(409).json({ message: "That email or name is already in use." });
  if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
  if (err.name === "CastError") return res.status(404).json({ message: "That item was not found." });
  console.error(err);
  res.status(500).json({ message: "Something went wrong. Please try again." });
}
