const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    food_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
    quantity: { type: Number, required: true, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderItem", orderItemSchema);
