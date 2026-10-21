import { describe, expect, it } from "vitest";
import { summarizeText, type SummaryStyle } from "../libs/summarize-service";
import { createFakeClient } from "./fake-openai";

const MODEL = "gpt-6-luna";

const STYLE_MARKERS: Record<SummaryStyle, string> = {
  "single-paragraph": "ONE single paragraph",
  general: "Format the summary in Markdown",
  "bullet-points": "bullet point list",
};

const STYLES = Object.keys(STYLE_MARKERS) as SummaryStyle[];

describe("summarizeText", () => {
  it.each(STYLES)("sends the %# style prompt and the user text to the model", async (style) => {
    const { client, create } = createFakeClient("summary");

    await summarizeText(client, "long text", style);

    expect(create).toHaveBeenCalledExactlyOnceWith({
      model: MODEL,
      messages: [
        { role: "system", content: expect.stringContaining(STYLE_MARKERS[style]) },
        { role: "user", content: "long text" },
      ],
    });
  });

  it("defaults to the general style", async () => {
    const { client, create } = createFakeClient("summary");

    await summarizeText(client, "long text");

    const call = create.mock.calls[0][0];
    expect(call.messages[0].content).toContain(STYLE_MARKERS.general);
  });

  it("uses a different system prompt per style", async () => {
    const prompts = new Set<string>();
    for (const style of STYLES) {
      const { client, create } = createFakeClient("summary");
      await summarizeText(client, "long text", style);
      prompts.add(create.mock.calls[0][0].messages[0].content);
    }
    expect(prompts.size).toBe(STYLES.length);
  });

  it("returns the summary from the completion", async () => {
    const { client } = createFakeClient("## Summary\nContent here.");

    const result = await summarizeText(client, "long text");

    expect(result).toBe("## Summary\nContent here.");
  });

  it("falls back to the original text when the completion has no content", async () => {
    const { client } = createFakeClient(null);

    const result = await summarizeText(client, "untouched text");

    expect(result).toBe("untouched text");
  });

  it("propagates API errors", async () => {
    const { client, create } = createFakeClient(null);
    create.mockRejectedValue(new Error("boom"));

    await expect(summarizeText(client, "long text")).rejects.toThrow("boom");
  });
});
