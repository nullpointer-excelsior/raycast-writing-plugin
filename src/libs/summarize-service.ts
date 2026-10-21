import OpenAI from "openai";

const MODEL = "gpt-6-luna";

export type SummaryStyle = "single-paragraph" | "general" | "bullet-points";

const PROMPTS: Record<SummaryStyle, string> = {
  "single-paragraph": `You are a text summarization assistant.

Summarize the text in the user message as ONE single paragraph in the same language as the input.

Rules:
- The summary MUST contain AT MOST 3 sentences and 40 words.
- NEVER include details, examples, numbers, or quotations.
- NEVER use lists, headings, or line breaks.
- Output ONLY the summary paragraph.

Example of the expected compression:

Text: "The open-source project received a major update yesterday. The maintainers rewrote the rendering engine to improve performance by 40 percent. Users reported faster startup times across all platforms. The team celebrated the release at a virtual event. They plan to launch a mobile version next year and hired three new contributors to support the roadmap."

Summary: The project released a major update that rewrote the rendering engine for a 40 percent performance gain and plans a mobile version next year.`,
  general: `You are a text summarization assistant.

Summarize the text in the user message in the same language as the input.

Rules:
- The summary MUST contain AT MOST 5 sentences and 80 words.
- NEVER include details, examples, numbers, or quotations.
- NEVER use lists or headings.
- Output ONLY the summary.

Example of the expected compression:

Text: "The open-source project received a major update yesterday. The maintainers rewrote the rendering engine to improve performance by 40 percent. Users reported faster startup times across all platforms. The team celebrated the release at a virtual event. They plan to launch a mobile version next year and hired three new contributors to support the roadmap."

Summary: The project released an update that boosted performance by 40 percent and plans a mobile version for next year.`,
  "bullet-points": `You are a text summarization assistant.

Summarize the text in the user message in the same language as the input.

Rules:
- The summary MUST be a bullet point list of AT MOST 5 bullets.
- Each bullet MUST be ONE short sentence of at most 15 words.
- NEVER use headings, numbers, or a closing paragraph.
- Output ONLY the bullet list.

Example of the expected compression:

Text: "The open-source project received a major update yesterday. The maintainers rewrote the rendering engine to improve performance by 40 percent. Users reported faster startup times across all platforms. The team celebrated the release at a virtual event. They plan to launch a mobile version next year and hired three new contributors to support the roadmap."

Summary:
- Major update released yesterday with a rewritten rendering engine.
- Users report faster startup times across platforms.
- Mobile version and three new contributors planned for next year.`,
};

export async function summarizeText(client: OpenAI, text: string, style: SummaryStyle = "general"): Promise<string> {
  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: PROMPTS[style] },
      { role: "user", content: text },
    ],
  });
  return completion.choices[0].message.content ?? text;
}
