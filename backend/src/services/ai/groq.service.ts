import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY as string,
});

export const generateAnswer = async (
  question: string,
  context: string
): Promise<string> => {
  const response = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL as string,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful second brain assistant. Answer only using the provided context. If the answer is not in the context, say you don't have enough information.",
      },
      {
        role: "user",
        content: `Context:\n${context}\n\nQuestion:\n${question}`,
      },
    ],
  });

  return response.choices[0]?.message?.content || "No answer generated.";
};