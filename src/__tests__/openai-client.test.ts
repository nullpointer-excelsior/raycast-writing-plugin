import { beforeEach, describe, expect, it } from "vitest";
import OpenAI from "openai";
import { createOpenAIClient } from "../libs/openai-client";
import { __setPreferences } from "../__mocks__/@raycast/api";

describe("createOpenAIClient", () => {
  beforeEach(() => {
    __setPreferences({});
  });

  it("builds a client with the API key from preferences", () => {
    __setPreferences({ openaiApiKey: "sk-test-key" });

    const client = createOpenAIClient();

    expect(client).toBeInstanceOf(OpenAI);
    expect((client as unknown as { apiKey: string }).apiKey).toBe("sk-test-key");
  });

  it("reads the key on every call", () => {
    __setPreferences({ openaiApiKey: "sk-first" });
    expect((createOpenAIClient() as unknown as { apiKey: string }).apiKey).toBe("sk-first");

    __setPreferences({ openaiApiKey: "sk-second" });
    expect((createOpenAIClient() as unknown as { apiKey: string }).apiKey).toBe("sk-second");
  });
});
