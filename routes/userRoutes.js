const express = require("express");
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin routes
router.get("/", protect, admin, getUsers);          // GET /api/users
router.get("/:id", protect, admin, getUserById);   // GET /api/users/:id
router.put("/:id", protect, admin, updateUser);    // PUT /api/users/:id
router.delete("/:id", protect, admin, deleteUser); // DELETE /api/users/:id

module.exports = router;
