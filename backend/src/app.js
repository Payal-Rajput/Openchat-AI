import express from "express";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { authMiddleware } from "./middlewares/authmiddleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// CORS configuration for cookies
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'], // Your frontend URL
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/chat', authMiddleware, chatRoutes);

// Test endpoint to check if server is running
app.get('/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

export default app;
