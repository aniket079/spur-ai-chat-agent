import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router as conversationRoutes } from "./routes/conversation.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", conversationRoutes);

const PORT = process.env.PORT || 4000;

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Spur AI Chat backend is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});