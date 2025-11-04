const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) res.json(user);
  else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user (Admin)
// @route   PUT /api/users/:id
// @access  Admin
const updateUser = asyncHandler(async (req, res) => {
  const { name, email, mobile, is_admin, address } = req.body;
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    user.mobile = mobile || user.mobile;
    user.is_admin = is_admin !== undefined ? is_admin : user.is_admin;
    user.address = address || user.address;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = { getUsers, getUserById, deleteUser, updateUser };
