const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Preparing", "Out for delivery", "Delivered", "Cancelled"],
      default: "Pending",
    },
    paymentMethod: { type: String, enum: ["COD", "Card", "UPI"], default: "COD" },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    deliveryAddress: {
    address: String,
    city: String,
    state: String,
    pincode: String,
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
