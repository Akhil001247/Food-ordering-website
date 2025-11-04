const express = require("express");
const {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/")
  .post(protect, createReview)
  .get(getReviews);

router.route("/:id")
  .get(getReviewById)
  .put(protect, updateReview)
  .delete(protect, admin, deleteReview);

module.exports = router;
