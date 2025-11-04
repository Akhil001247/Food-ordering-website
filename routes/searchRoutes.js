const express = require("express");
const Hotel = require("../models/Hotel");
const Food = require("../models/Food");

const router = express.Router();

// GET /api/search?q=keyword
router.get("/", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json({ foods: [], hotels: [] });

    const regex = new RegExp(q, "i"); // case-insensitive match

    const foods = await Food.find({ name: regex }).limit(5);
    const hotels = await Hotel.find({ name: regex }).limit(5);

    res.json({ foods, hotels });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
