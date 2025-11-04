const asyncHandler = require("express-async-handler");
const Review = require("../models/Review");

// @desc   Create a review
// @route  POST /api/reviews
// @access Private
const createReview = asyncHandler(async (req, res) => {
  const { food_id, rating, comment } = req.body;

  if (!food_id || !rating) {
    res.status(400);
    throw new Error("Food ID and rating are required");
  }

  const review = await Review.create({
    user_id: req.user._id,
    food_id,
    rating,
    comment,
  });

  res.status(201).json(review);
});

// @desc   Get all reviews
// @route  GET /api/reviews
// @access Public
const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({})
    .populate("user_id", "name email")
    .populate("food_id", "name");
  res.json(reviews);
});

// @desc   Get review by ID
const getReviewById = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
    .populate("user_id", "name email")
    .populate("food_id", "name");

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  res.json(review);
});

// @desc   Update review
const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  if (review.user_id.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  review.rating = req.body.rating || review.rating;
  review.comment = req.body.comment || review.comment;

  const updatedReview = await review.save();
  res.json(updatedReview);
});

// @desc   Delete review
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  if (
    review.user_id.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await review.deleteOne();
  res.json({ message: "Review removed" });
});

module.exports = {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
