import { Router } from "express";
import {
  createConversation,
  addUserMessageHandler,
  getMessages,
} from "../controllers/conversation.controller";

const router = Router();

router.post("/conversations", createConversation);
router.get("/conversations/:id/messages", getMessages);
router.post("/chat/message", addUserMessageHandler);

export { router };
