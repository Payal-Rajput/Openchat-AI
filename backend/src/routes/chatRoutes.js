import express from "express";
import multer from "multer";
import { createChatController, getChatHistoryController } from "../controllers/chat.controller.js";

const router = express.Router();
const upload = multer();

router.post('/create', upload.single('image'), createChatController)
router.get('/chat-history', getChatHistoryController)

export default router

