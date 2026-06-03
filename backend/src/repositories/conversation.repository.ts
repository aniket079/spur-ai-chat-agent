import { prisma } from "../db/prisma";

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
