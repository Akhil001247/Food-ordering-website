const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

// User
router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);

// Admin
router.get("/", protect, admin, getAllOrders);
router.get("/:id", protect, admin, getOrderById);
router.put("/:id", protect, admin, updateOrderStatus);
router.delete("/:id", protect, admin, deleteOrder);

module.exports = router;
