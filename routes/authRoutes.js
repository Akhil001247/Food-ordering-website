// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");
const { protect, admin } = require("../middleware/authMiddleware");

// 👤 Public Auth
router.post("/register", registerUser);   // Register new user
router.post("/login", loginUser);         // Login

//  Private (logged-in users only)
router.get("/profile", protect, getUserProfile);

//  Admin-only route 
router.get("/admin/dashboard", protect, admin, (req, res) => {
  res.json({
    message: "Welcome Admin",
    user: req.user,  // current admin user
  });
});

module.exports = router;
