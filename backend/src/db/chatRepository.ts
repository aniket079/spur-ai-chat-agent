import { PrismaClient, Sender } from "@prisma/client";

export class ChatRepository {
  constructor(private readonly prisma: PrismaClient) {}

  getConversationById(id: string) {
    return this.prisma.conversation.findUnique({
      where: { id },
    });
  }

  listConversations(limit?: number) {
    return this.prisma.conversation.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  createConversation() {
    return this.prisma.conversation.create({
      data: {},
    });
  }

  getMessageById(id: string) {
    return this.prisma.message.findUnique({
      where: { id },
    });
  }

  listMessagesByConversation(conversationId: string) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });
  }

  createMessage(conversationId: string, sender: Sender, text: string) {
    return this.prisma.message.create({
      data: {
        conversationId,
        sender,
        text,
      },
    });
  }
}
