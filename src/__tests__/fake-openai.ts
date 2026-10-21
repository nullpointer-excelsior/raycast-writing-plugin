import { vi } from "vitest";
import type OpenAI from "openai";

interface FakeClientFactory {
  client: OpenAI;
  create: ReturnType<typeof vi.fn>;
}

/**
 * Build a minimal OpenAI client fake covering the only surface the services
 * use (chat.completions.create) plus the mock for request assertions.
 */
export function createFakeClient(content: string | null): FakeClientFactory {
  const create = vi.fn().mockResolvedValue({
    choices: [{ message: { content } }],
  });
  const client = { chat: { completions: { create } } };
  return { client: client as unknown as OpenAI, create };
}
