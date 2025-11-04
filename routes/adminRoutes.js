// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const User = require("../models/User");
const { getAdminStats } = require("../controllers/adminController");

// 👥 Get all users
router.get("/users", protect, admin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});
router.get("/stats", protect, admin, getAdminStats);
// ❌ Delete user
router.delete("/users/:id", protect, admin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  await user.deleteOne();
  res.json({ message: "User removed" });
});

// 🔑 Update role
router.put("/users/:id/role", protect, admin, async (req, res) => {
  const { role } = req.body; // "user" or "admin"
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.role = role;
  await user.save();
  res.json({ message: "User role updated", user });
});

module.exports = router;
