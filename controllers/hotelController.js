const asyncHandler = require("express-async-handler");
const Hotel = require("../models/Hotel");
const Food = require("../models/Food");

// @desc Create new hotel (Admin only)
const createHotel = asyncHandler(async (req, res) => {
  const { name, cuisine, location, state, pincode, contact, avgPrice } = req.body;

  const hotel = new Hotel({
    name,
    cuisine,
    location,
    state,
    pincode,
    contact,
    avgPrice,
    image: req.file ? `/uploads/hotels/${req.file.filename}` : "",
  });

  const createdHotel = await hotel.save();
  res.status(201).json(createdHotel);
});

// @desc Get all hotels
const getHotels = asyncHandler(async (req, res) => {
  const fetchAll = req.query.all === "true";
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  if (fetchAll) {
    const hotels = await Hotel.find({}).sort({ createdAt: -1 });
    return res.json({ hotels });
  }

  const count = await Hotel.countDocuments({});
  const hotels = await Hotel.find({})
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    hotels,
    page,
    pages: Math.ceil(count / pageSize),
  });
});

// @desc Get single hotel by ID
const getHotelById = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    res.status(404);
    throw new Error("Hotel not found");
  }

  // ✅ Correct field name is "hotel" (matches Food schema)
  const foods = await Food.find({ hotel: hotel._id }).populate("hotel", "name");

  console.log("Foods fetched for hotel:", foods); // Optional debug log

  res.json({ hotel, foods });
});

// @desc Update hotel (Admin only)
const updateHotel = asyncHandler(async (req, res) => {
  const { name, cuisine, location, avgPrice, isActive } = req.body;
  const hotel = await Hotel.findById(req.params.id);

  if (hotel) {
    hotel.name = name || hotel.name;
    hotel.cuisine = cuisine || hotel.cuisine;
    hotel.location = location || hotel.location;
    hotel.avgPrice = avgPrice || hotel.avgPrice;
    hotel.isActive = isActive ?? hotel.isActive;
    if (req.file) {
      hotel.image = `/uploads/hotels/${req.file.filename}`;
    }

    const updatedHotel = await hotel.save();
    res.json(updatedHotel);
  } else {
    res.status(404);
    throw new Error("Hotel not found");
  }
});

// @desc Delete hotel (Admin only)
const deleteHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (hotel) {
    await hotel.deleteOne();
    res.json({ message: "Hotel removed" });
  } else {
    res.status(404);
    throw new Error("Hotel not found");
  }
});

module.exports = {
  createHotel,
  getHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
};
