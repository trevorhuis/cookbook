/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./test/setup-test-env.ts"],
    coverage: {
      reporter: ["text", "json", "html"],
    },
    poolOptions: {
      threads: {
        minThreads: 1,
        maxThreads: 1,
      },
    },
  },
});
