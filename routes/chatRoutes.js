const express = require("express");
const {
  createChat,
  getChats,
  getChatById,
  deleteChat,
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Only logged-in users can send/view chats
router.route("/")
  .post(protect, createChat)
  .get(protect, getChats);

router.route("/:id")
  .get(protect, getChatById)
  .delete(protect, deleteChat);

module.exports = router;
