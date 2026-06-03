import { Sender } from "@prisma/client";
import { createConversation, getConversationById } from "../repositories/conversation.repository.js";
import { createMessage, getMessagesByConversationId } from "../repositories/message.repository.js";
import { generateReply, type Message as LLMMessage } from "./llm.service.js";

export async function createConversationService() {
  return createConversation();
}

export async function addUserMessage(conversationId: string | undefined, text: string) {
  // Step 1 & 2: Create conversation if missing, verify if provided
  const conversation = conversationId ? await getConversationById(conversationId) : null;

  if (conversationId && !conversation) {
    throw new Error(`Conversation not found for id: ${conversationId}`);
  }

  const savedConversation = conversation || (await createConversation());

  // Step 3: Save user message
  const userMessage = await createMessage(savedConversation.id, Sender.USER, text);

  // Step 4: Fetch recent messages for history
  const allMessages = await getMessagesByConversationId(savedConversation.id);

  // Convert database messages to LLM format (excluding the one we just saved to get history)
  const history: LLMMessage[] = allMessages
    .filter((msg: (typeof allMessages)[0]) => msg.id !== userMessage.id)
    .map((msg: (typeof allMessages)[0]) => ({
      role: msg.sender === Sender.USER ? "user" : "assistant",
      content: msg.text,
    }));

  // Step 5: Call LLM to generate reply
  const aiReplyText = await generateReply(history, text);

  // Step 6: Save AI reply
  const aiMessage = await createMessage(savedConversation.id, Sender.AI, aiReplyText);

  return {
    sessionId: savedConversation.id,
    reply: aiMessage,
  };
}

export async function getConversationMessages(conversationId: string) {
  const conversation = await getConversationById(conversationId);

  if (!conversation) {
    throw new Error(`Conversation not found for id: ${conversationId}`);
  }

  return getMessagesByConversationId(conversationId);
}
