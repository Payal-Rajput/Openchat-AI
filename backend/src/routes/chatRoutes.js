import express from "express";
import { createChatController } from "../controllers/chat.controller.js";

const router = express.Router();

router.post('/create', createChatController)

export default router

