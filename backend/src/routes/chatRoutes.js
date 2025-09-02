import express from "express";
import multer from "multer";
import { createChatController, getChatHistoryController, deleteAllChatsController, deleteChatByIdController } from "../controllers/chat.controller.js";

const router = express.Router();
const upload = multer();

// Add middleware to log all requests
router.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Route hit`);
  next();
});

router.post('/create', upload.single('image'), createChatController)
router.get('/chat-history', getChatHistoryController)
router.delete('/delete-all', deleteAllChatsController)
router.delete('/:id', deleteChatByIdController)

export default router

