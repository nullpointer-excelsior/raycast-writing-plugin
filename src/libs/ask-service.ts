import OpenAI from "openai";

const MODEL = "gpt-6-luna";

const PROMPT = `You are a text question-answering assistant.

Answer the question in the user message using ONLY the provided text.

Rules:
- Answer in the same language as the question.
- Base the answer exclusively on the text and NEVER invent information.
- If the text does not contain the answer, say so explicitly.
- Format the answer in Markdown and keep it concise.
- Output ONLY the answer.`;

export async function askAboutText(client: OpenAI, question: string, text: string): Promise<string> {
  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: PROMPT },
      { role: "user", content: `Question: ${question}\n\nText:\n${text}` },
    ],
  });
  return completion.choices[0].message.content ?? text;
}
