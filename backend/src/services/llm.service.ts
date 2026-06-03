import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are a helpful customer support assistant for SwiftCart, a fictional ecommerce store.

Store Information:
- Shipping within India takes 3–5 business days
- International shipping is not currently available
- Returns are accepted within 7 days of delivery
- Refunds are processed within 5–7 business days after return approval
- Orders can be cancelled within 12 hours of placing them
- Support hours are Monday to Saturday, 10 AM to 6 PM IST

Rules:
- Answer clearly and concisely
- If the answer is not in the store knowledge above, say you do not have that information and suggest contacting support
- Do not make up policies
- Be helpful and friendly`;

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function generateReply(history: Message[], userMessage: string): Promise<string> {
  try {
    // Limit to last 10 messages from history
    const recentHistory = history.slice(-10);

    const messages = [
      {
        role: "system" as const,
        content: SYSTEM_PROMPT,
      },
      ...recentHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: "user" as const,
        content: userMessage,
      },
    ];

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages,
      temperature: 0.2,
      max_tokens: 250,
    });

    return response.choices[0]?.message?.content || "I'm having trouble connecting to support right now. Please try again in a moment.";
  } catch (error) {
    console.error("LLM Service Error:", error instanceof Error ? error.message : "Unknown error");
    return "I'm having trouble connecting to support right now. Please try again in a moment.";
  }
}
