const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  createHotel,
  getHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
} = require("../controllers/hotelController");
const upload = require("../middleware/uploadMiddleware");

// Public
router.get("/", getHotels);
router.get("/:id", getHotelById);

// Admin CRUD (with upload middleware)
router.post("/", protect, admin, upload.single("image"), createHotel);
router.put("/:id", protect, admin, upload.single("image"), updateHotel);
router.delete("/:id", protect, admin, deleteHotel);

module.exports = router;
