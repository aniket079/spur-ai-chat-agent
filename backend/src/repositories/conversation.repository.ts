import { prisma } from "../db/prisma.js";

export function createConversation() {
  return prisma.conversation.create({
    data: {},
  });
}

export function getConversationById(id: string) {
  return prisma.conversation.findUnique({
    where: { id },
  });
}
