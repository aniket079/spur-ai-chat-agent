import type { Request, Response } from "express";
import {
  createConversationService,
  addUserMessage,
  getConversationMessages,
} from "../services/conversation.service";

function sendError(res: Response, status: number, message: string) {
  return res.status(status).json({ error: message });
}

export async function createConversation(req: Request, res: Response) {
  try {
    const conversation = await createConversationService();
    return res.status(201).json(conversation);
  } catch (error) {
    return sendError(res, 500, "Unable to create conversation");
  }
}

export async function addUserMessageHandler(req: Request, res: Response) {
  try {
    const { message, sessionId } = req.body as { message?: string; sessionId?: string };

    if (typeof message !== "string") {
      return sendError(res, 400, "Message is required");
    }

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return sendError(res, 400, "Message must not be empty");
    }

    if (trimmedMessage.length > 2000) {
      return sendError(res, 400, "Message must not exceed 2000 characters");
    }

    const result = await addUserMessage(sessionId, trimmedMessage);

    return res.json({ sessionId: result.conversationId, message: result.message });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to add user message";
    return sendError(res, 400, message);
  }
}

export async function getMessages(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return sendError(res, 400, "Conversation id is required");
    }

    const messages = await getConversationMessages(id);
    return res.json({ sessionId: id, messages });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to retrieve messages";
    return sendError(res, 400, message);
  }
}
