const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String }, // 🏠 Added address
    city: { type: String }, // 🏙️ Added city
    location: { type: String },
    state: { type: String },
    pincode: { type: String },
    contact: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hotel", hotelSchema);
