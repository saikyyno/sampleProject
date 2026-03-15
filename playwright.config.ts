import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./tests",
    testMatch: ["**/*.spec.ts"],   // тільки *.spec.ts у tests/
    testIgnore: ["**/*.test.ts"],  // ігнорувати Jest-файли, якщо раптом там є
});