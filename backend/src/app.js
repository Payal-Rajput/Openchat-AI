import express from "express";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
const app = express();

app.use(express.json());

app.use('/auth',authRoutes);
app.use('/chat',chatRoutes);

export default app;