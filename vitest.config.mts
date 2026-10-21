import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// @raycast/api ships types only; the implementation is injected by the Raycast
// host at runtime, so every import must be redirected to a test stub.
const raycastApiStub = fileURLToPath(new URL("./src/__mocks__/@raycast/api.ts", import.meta.url));

export default defineConfig({
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "node",
  },
  resolve: {
    alias: {
      "@raycast/api": raycastApiStub,
    },
  },
});
