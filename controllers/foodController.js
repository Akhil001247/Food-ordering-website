// controllers/foodController.js
const asyncHandler = require("express-async-handler");
const Food = require("../models/Food");

// @desc    Create new food
// @route   POST /api/foods
// @access  Admin
const createFood = asyncHandler(async (req, res) => {
  const { name, description, hotel, price, stock } = req.body;

  if (!name || !description || !hotel || !price) {
    res.status(400);
    throw new Error("Please add all required fields");
  }

  // multer adds req.file
  const image = req.file ? `/uploads/foodimages/${req.file.filename}` : null;

  if (!image) {
    res.status(400);
    throw new Error("Image is required");
  }

  const food = new Food({
    name,
    description,
    hotel,
    price,
    stock: stock || 0,
    image, // ✅ from multer
  });

  const createdFood = await food.save();

  // populate hotel name for response
  await createdFood.populate("hotel", "name");

  res.status(201).json(createdFood);
});

// @desc    Update food
// @route   PUT /api/foods/:id
// @access  Admin
const updateFood = asyncHandler(async (req, res) => {
  const { name, description, hotel, price, stock } = req.body;

  const food = await Food.findById(req.params.id);

  if (food) {
    food.name = name || food.name;
    food.description = description || food.description;
    food.hotel = hotel || food.hotel;
    food.price = price || food.price;
    food.stock = stock !== undefined ? stock : food.stock;

    // update image if a new file is uploaded
    if (req.file) {
     food.image = `/uploads/foodimages/${req.file.filename}`;
    }

    const updatedFood = await food.save();

    // populate hotel name for response
    await updatedFood.populate("hotel", "name");

    res.json(updatedFood);
  } else {
    res.status(404);
    throw new Error("Food not found");
  }
});

// @desc    Get all foods
// @route   GET /api/foods
// @access  Public
const getFoods = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 100;
  const skip = (page - 1) * limit;

  const total = await Food.countDocuments();

  // populate hotel name
  const foods = await Food.find()
    .populate("hotel", "name")
    .skip(skip)
    .limit(limit);

  res.json({
    foods,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

// @desc    Get food by ID
// @route   GET /api/foods/:id
// @access  Public
const getFoodById = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id).populate("hotel", "name");
  if (food) {
    res.json(food);
  } else {
    res.status(404);
    throw new Error("Food not found");
  }
});

// @desc    Delete food
// @route   DELETE /api/foods/:id
// @access  Admin
const deleteFood = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (food) {
    await food.deleteOne();
    res.json({ message: "Food removed" });
  } else {
    res.status(404);
    throw new Error("Food not found");
  }
});

module.exports = {
  createFood,
  getFoods,
  getFoodById,
  updateFood,
  deleteFood,
};
