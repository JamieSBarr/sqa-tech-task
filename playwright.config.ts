import { defineConfig } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";
import { config } from "./src/config";

const testDir = defineBddConfig({
  features: "src/features/*.feature",
  steps: ["src/1-playwright-bdd/steps/*.ts", "src/1-playwright-bdd/fixtures.ts"],
});

export default defineConfig({
  testDir,
  reporter: "html",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    trace: "on",
    baseURL: config.BASE_URL,
  },
  outputDir: "./output",
});
