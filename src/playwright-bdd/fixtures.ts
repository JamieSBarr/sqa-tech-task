import { test as base, createBdd } from "playwright-bdd";
import { AgifyUtils } from "./utils/agify-utils.ts";
import type { Ctx } from "./types.ts";

interface TestFixtures {
  ctx: Ctx;
  agifyUtils: AgifyUtils;
}

export const test = base.extend<TestFixtures>({
  agifyUtils: async ({ request }, use) => {
    await use(new AgifyUtils(request));
  },
  ctx: async ({}, use) => {
    const ctx = {} as Ctx;
    await use(ctx);
  },
});

export const { Given, When, Then } = createBdd(test);
