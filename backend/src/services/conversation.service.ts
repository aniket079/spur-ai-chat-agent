import { Sender } from "@prisma/client";
import { createConversation, getConversationById } from "../repositories/conversation.repository";
import { createMessage, getMessagesByConversationId } from "../repositories/message.repository";

export async function createConversationService() {
  return createConversation();
}

export async function addUserMessage(conversationId: string | undefined, text: string) {
  const conversation = conversationId ? await getConversationById(conversationId) : null;

  if (conversationId && !conversation) {
    throw new Error(`Conversation not found for id: ${conversationId}`);
  }

  const savedConversation = conversation || (await createConversation());
  const message = await createMessage(savedConversation.id, Sender.USER, text);

  return {
    conversationId: savedConversation.id,
    message,
  };
}

export async function getConversationMessages(conversationId: string) {
  const conversation = await getConversationById(conversationId);

  if (!conversation) {
    throw new Error(`Conversation not found for id: ${conversationId}`);
  }

  return getMessagesByConversationId(conversationId);
}
