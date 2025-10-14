import { defineConfig } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

const testDir = defineBddConfig({
  features: "src/features/*.feature",
  steps: ["src/playwright-bdd/steps/*.ts", "src/playwright-bdd/fixtures.ts"],
});

export default defineConfig({
  testDir,
  reporter: "html",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    trace: "retain-on-failure",
    baseURL: process.env.BASE_URL,
  },
  outputDir: "./output",
});
