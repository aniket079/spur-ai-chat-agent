import type { Sender } from "@prisma/client";
import { prisma } from "../db/prisma";

export function createMessage(conversationId: string, sender: Sender, text: string) {
  return prisma.message.create({
    data: {
      conversationId,
      sender,
      text,
    },
  });
}

export function getMessagesByConversationId(conversationId: string) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });
}
