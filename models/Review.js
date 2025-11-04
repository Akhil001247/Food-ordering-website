const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    food_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
    },
    hotel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
