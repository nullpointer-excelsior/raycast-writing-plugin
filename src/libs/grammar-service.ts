import OpenAI from "openai";

const MODEL = "gpt-4.1-nano";

const PROMPT = "Correct the grammar and spelling of the text in the input language.";

export async function correctGrammar(client: OpenAI, text: string): Promise<string> {
  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: PROMPT },
      { role: "user", content: text },
    ],
  });
  return completion.choices[0].message.content ?? text;
}
