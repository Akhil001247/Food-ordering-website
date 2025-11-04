const asyncHandler = require("express-async-handler");
const Chat = require("../models/Chat");

// @desc    Create a chat message
// @route   POST /api/chats
// @access  Private
const createChat = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    res.status(400);
    throw new Error("Message is required");
  }

  // Save user message in DB
  const chat = await Chat.create({
    sender_id: req.user._id,
    message,
  });

  // Dummy bot reply (placeholder until AI integration)
  const reply = `🤖 Thanks for your message: "${message}"`;

  // Send back both saved chat & reply
  res.status(201).json({ reply, chat });
});

// @desc    Get all chats
// @route   GET /api/chats
// @access  Admin
const getChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({}).populate("sender_id", "name email");
  res.json(chats);
});

// @desc    Get chat by ID
// @route   GET /api/chats/:id
// @access  Private
const getChatById = asyncHandler(async (req, res) => {
  const chat = await Chat.findById(req.params.id).populate("sender_id", "name email");

  if (!chat) {
    res.status(404);
    throw new Error("Chat not found");
  }

  res.json(chat);
});

// @desc    Delete chat
// @route   DELETE /api/chats/:id
// @access  Private/Admin
const deleteChat = asyncHandler(async (req, res) => {
  const chat = await Chat.findById(req.params.id);

  if (!chat) {
    res.status(404);
    throw new Error("Chat not found");
  }

  await chat.deleteOne();
  res.json({ message: "Chat deleted" });
});

module.exports = { createChat, getChats, getChatById, deleteChat };
