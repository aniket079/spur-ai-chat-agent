import { Sender } from "@prisma/client";
import { prisma } from "./prisma.js";

export class ChatRepository {
  getConversationById(id: string) {
    return prisma.conversation.findUnique({
      where: { id },
    });
  }

  listConversations(limit?: number) {
    return prisma.conversation.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  createConversation() {
    return prisma.conversation.create({
      data: {},
    });
  }

  getMessageById(id: string) {
    return prisma.message.findUnique({
      where: { id },
    });
  }

  listMessagesByConversation(conversationId: string) {
    return prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });
  }

  createMessage(conversationId: string, sender: Sender, text: string) {
    return prisma.message.create({
      data: {
        conversationId,
        sender,
        text,
      },
    });
  }
}

export const chatRepository = new ChatRepository();
