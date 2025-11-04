// routes/foodRoutes.js
const express = require("express");
const router = express.Router();
const {
  createFood,
  getFoods,
  getFoodById,
  updateFood,
  deleteFood,
} = require("../controllers/foodController");
const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Public Routes
router.get("/", getFoods);
router.get("/:id", getFoodById);

// Admin CRUD with image upload
router.post("/", protect, admin, upload.single("image"), createFood);
router.put("/:id", protect, admin, upload.single("image"), updateFood);
router.delete("/:id", protect, admin, deleteFood);

module.exports = router;
