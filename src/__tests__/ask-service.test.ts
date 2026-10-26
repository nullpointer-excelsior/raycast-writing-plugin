import { describe, expect, it } from "vitest";
import { askAboutText } from "../libs/ask-service";
import { createFakeClient } from "./fake-openai";

const MODEL = "gpt-6-luna";

describe("askAboutText", () => {
  it("sends the system prompt, the question and the text to the model", async () => {
    const { client, create } = createFakeClient("answer");

    await askAboutText(client, "What is the main idea?", "Some text");

    expect(create).toHaveBeenCalledExactlyOnceWith({
      model: MODEL,
      messages: [
        { role: "system", content: expect.stringContaining("Answer the question") },
        { role: "user", content: "Question: What is the main idea?\n\nText:\nSome text" },
      ],
    });
  });

  it("returns the answer from the completion", async () => {
    const { client } = createFakeClient("The main idea is growth.");

    const result = await askAboutText(client, "What is the main idea?", "Some text");

    expect(result).toBe("The main idea is growth.");
  });

  it("falls back to the original text when the completion has no content", async () => {
    const { client } = createFakeClient(null);

    const result = await askAboutText(client, "Any question?", "untouched text");

    expect(result).toBe("untouched text");
  });

  it("propagates API errors", async () => {
    const { client, create } = createFakeClient(null);
    create.mockRejectedValue(new Error("boom"));

    await expect(askAboutText(client, "Any question?", "text")).rejects.toThrow("boom");
  });
});
