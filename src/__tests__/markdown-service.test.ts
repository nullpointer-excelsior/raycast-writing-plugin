import { describe, expect, it } from "vitest";
import { convertToMarkdown } from "../libs/markdown-service";
import { createFakeClient } from "./fake-openai";

const MODEL = "gpt-6-luna";

describe("convertToMarkdown", () => {
  it("sends the Markdown prompt and the user text to the model", async () => {
    const { client, create } = createFakeClient("# Title");

    await convertToMarkdown(client, "plain text");

    expect(create).toHaveBeenCalledExactlyOnceWith({
      model: MODEL,
      messages: [
        { role: "system", content: expect.stringContaining("Markdown") },
        { role: "user", content: "plain text" },
      ],
    });
  });

  it("asks for headings, emojis, lists and tables", async () => {
    const { client, create } = createFakeClient("# Title");

    await convertToMarkdown(client, "plain text");

    const prompt = create.mock.calls[0][0].messages[0].content;
    expect(prompt).toContain("level-1 heading");
    expect(prompt).toContain("emoji");
    expect(prompt).toContain("bullet list");
    expect(prompt).toContain("table");
  });

  it("returns the Markdown from the completion", async () => {
    const { client } = createFakeClient("# Title\n\n## Section");

    const result = await convertToMarkdown(client, "plain text");

    expect(result).toBe("# Title\n\n## Section");
  });

  it("falls back to the original text when the completion has no content", async () => {
    const { client } = createFakeClient(null);

    const result = await convertToMarkdown(client, "untouched text");

    expect(result).toBe("untouched text");
  });

  it("propagates API errors", async () => {
    const { client, create } = createFakeClient(null);
    create.mockRejectedValue(new Error("boom"));

    await expect(convertToMarkdown(client, "plain text")).rejects.toThrow("boom");
  });
});
