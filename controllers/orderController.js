const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");

// @desc Create new order (User)
const createOrder = asyncHandler(async (req, res) => {
  const { items, totalPrice, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  const order = new Order({
    user: req.user._id,
    items,
    totalPrice,
    paymentMethod,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc Get logged in user orders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate("items.food");
  res.json(orders);
});

// @desc Get all orders (Admin)
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "name email")
    .populate("items.food");
  res.json(orders);
});

// @desc Get single order (Admin)
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("items.food");

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc Update order status (Admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, isPaid } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    if (status) order.status = status;
    if (isPaid !== undefined) {
      order.isPaid = isPaid;
      if (isPaid) order.paidAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc Delete order (Admin)
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    await order.deleteOne();
    res.json({ message: "Order removed" });
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
