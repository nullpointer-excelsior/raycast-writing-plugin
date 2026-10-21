// Test stub for @raycast/api. The real package ships types only and cannot be
// resolved by the test runner; vitest.config.ts aliases imports to this file.
import { vi } from "vitest";

let preferences: Record<string, unknown> = {};

/** Configure the value returned by getPreferenceValues in tests. */
export function __setPreferences(next: Record<string, unknown>): void {
  preferences = next;
}

export function getPreferenceValues<T>(): T {
  return preferences as T;
}

export const AI = {
  ask: vi.fn((prompt: string) => Promise.resolve(`mocked:${prompt}`)),
};

export const environment = {
  canAccess: vi.fn(() => false),
};

export const Clipboard = {
  copy: vi.fn(() => Promise.resolve()),
  paste: vi.fn(() => Promise.resolve("")),
  read: vi.fn(() => Promise.resolve("")),
  clear: vi.fn(() => Promise.resolve()),
};

export const showToast = vi.fn(() => Promise.resolve());
export const showHUD = vi.fn(() => Promise.resolve());
export const closeMainWindow = vi.fn(() => Promise.resolve());
