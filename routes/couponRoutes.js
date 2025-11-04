const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
} = require("../controllers/couponController");

// ========================
// Admin-only CRUD routes
// ========================
router.post("/", protect, admin, createCoupon);
router.get("/", protect, admin, getAllCoupons);
router.get("/:id", protect, admin, getCouponById);
router.put("/:id", protect, admin, updateCoupon);
router.delete("/:id", protect, admin, deleteCoupon);

// ========================
// Public/User route to apply a coupon
// ========================
router.post("/apply", applyCoupon);

module.exports = router;
