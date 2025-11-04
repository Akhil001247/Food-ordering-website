const asyncHandler = require("express-async-handler");
const Coupon = require("../models/Coupon");

// ========================
// Admin Controllers
// ========================

// @desc Create new coupon (Admin)
const createCoupon = asyncHandler(async (req, res) => {
  const { code, discountType, discountValue, minOrderValue, expiryDate, isActive } = req.body;

  if (!code || !discountType || discountValue === undefined || !expiryDate) {
    res.status(400);
    throw new Error("All required fields (code, discountType, discountValue, expiryDate) must be provided");
  }

  const exists = await Coupon.findOne({ code });
  if (exists) {
    res.status(400);
    throw new Error("Coupon code already exists");
  }

  const coupon = await Coupon.create({
    code,
    discountType,
    discountValue,
    minOrderValue,
    expiryDate,
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json(coupon);
});

// @desc Get all coupons (Admin)
const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({});
  res.json(coupons);
});

// @desc Get single coupon (Admin)
const getCouponById = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (coupon) {
    res.json(coupon);
  } else {
    res.status(404);
    throw new Error("Coupon not found");
  }
});

// @desc Update coupon (Admin)
const updateCoupon = asyncHandler(async (req, res) => {
  const { code, discountType, discountValue, minOrderValue, expiryDate, isActive } = req.body;

  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  coupon.code = code || coupon.code;
  coupon.discountType = discountType || coupon.discountType;
  coupon.discountValue = discountValue !== undefined ? discountValue : coupon.discountValue;
  coupon.minOrderValue = minOrderValue !== undefined ? minOrderValue : coupon.minOrderValue;
  coupon.expiryDate = expiryDate || coupon.expiryDate;
  coupon.isActive = isActive !== undefined ? isActive : coupon.isActive;

  const updatedCoupon = await coupon.save();
  res.json(updatedCoupon);
});

// @desc Delete coupon (Admin)
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  await coupon.deleteOne();
  res.json({ message: "Coupon removed" });
});

// ========================
// User Controller
// ========================

// @desc Apply a coupon (User)
const applyCoupon = asyncHandler(async (req, res) => {
  const { code, orderTotal } = req.body;

  if (!code) {
    res.status(400);
    throw new Error("Coupon code is required");
  }

  const coupon = await Coupon.findOne({ code, isActive: true });
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found or inactive");
  }

  const now = new Date();
  if (coupon.expiryDate < now) {
    res.status(400);
    throw new Error("Coupon has expired");
  }

  if (coupon.minOrderValue && orderTotal < coupon.minOrderValue) {
    res.status(400);
    throw new Error(`Minimum order value for this coupon is ${coupon.minOrderValue}`);
  }

  // Calculate discount
  let discountAmount = 0;
  if (coupon.discountType === "percentage") {
    discountAmount = (orderTotal * coupon.discountValue) / 100;
  } else {
    discountAmount = coupon.discountValue;
  }

  res.json({
    success: true,
    discountAmount,
    finalAmount: orderTotal - discountAmount,
    coupon,
  });
});

module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
};
