import { test as base, createBdd } from "playwright-bdd";
import { AgifyUtils } from "./utils/agify-utils.ts";

interface Ctx {
  name: string;
  names: string[];
  body: Record<string, string>;
  status: number;
  countryId: string;
}

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
