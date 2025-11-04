const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    image: String,
    isVeg: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel", // ✅ This is essential for populate() to work
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);
