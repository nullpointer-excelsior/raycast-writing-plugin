import { describe, expect, it } from "vitest";
import { correctGrammar } from "../libs/grammar-service";
import { createFakeClient } from "./fake-openai";

const MODEL = "gpt-6-luna";

describe("correctGrammar", () => {
  it("returns the corrected text from the completion", async () => {
    const { client, create } = createFakeClient("Hello world.");
    create.mockResolvedValue({ choices: [{ message: { content: "Hello world." } }] });

    const result = await correctGrammar(client, "helo worl d");

    expect(result).toBe("Hello world.");
  });

  it("sends the grammar system prompt and the user text to the model", async () => {
    const { client, create } = createFakeClient("ok");

    await correctGrammar(client, "some text");

    expect(create).toHaveBeenCalledExactlyOnceWith({
      model: MODEL,
      messages: [
        { role: "system", content: expect.stringContaining("Correct the grammar and spelling") },
        { role: "user", content: "some text" },
      ],
    });
  });

  it("falls back to the original text when the completion has no content", async () => {
    const { client } = createFakeClient(null);

    const result = await correctGrammar(client, "untouched text");

    expect(result).toBe("untouched text");
  });

  it("propagates API errors", async () => {
    const { client, create } = createFakeClient(null);
    create.mockRejectedValue(new Error("boom"));

    await expect(correctGrammar(client, "text")).rejects.toThrow("boom");
  });
});
