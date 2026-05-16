import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/render.tsx"],
    exclude: ["tests/e2e/**", "**/node_modules/**", ".worktrees/**", ".next/**"],
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname
    }
  }
});
