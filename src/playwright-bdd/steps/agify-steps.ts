import { expect } from "@playwright/test";
import { Given, Then } from "../fixtures.ts";
import Chance from "chance";
import type { Method } from "../types.ts";

const chance = new Chance();

Given("I call the Agify API with a single name", async ({ agifyUtils, ctx }) => {
  const name = chance.first();
  const { body, status } = await agifyUtils.makeRequest({ name });
  ctx.name = name;
  ctx.body = body;
  ctx.status = status;
});

Then("I expect a {int} status code", async ({ ctx }, status: number) => {
  expect(ctx.status).toBe(status);
});

Then("I expect the response body to contain the name, a count and an age", async ({ ctx }) => {
  expect(ctx.body).toMatchObject({
    name: ctx.name,
    count: expect.any(Number),
    age: expect.any(Number),
  });
});

Given("I call the Agify API with {int} names", async ({ agifyUtils, ctx }, numberOfNames: number) => {
  let params = "";
  const names: string[] = [];

  for (let i = 0; i < numberOfNames; i++) {
    const name = chance.first();
    params += `name[]=${name}&`;
    names.push(name);
  }

  const { body, status } = await agifyUtils.makeRequest(params);

  ctx.names = names;
  ctx.body = body;
  ctx.status = status;
});

Then("I expect the response body to contain a count and age for each name", async ({ ctx }) => {
  const expectedResponse = ctx.names.map((name) => ({
    name,
    count: expect.any(Number),
    age: expect.any(Number),
  }));

  expect(ctx.body).toMatchObject(expectedResponse);
});

Given("I call the Agify API with a single name and country code", async ({ agifyUtils, ctx }) => {
  const countryId = chance.pickone(["US", "GB", "CA", "AU"]);
  const name = chance.first({ nationality: "en" });

  const { body, status } = await agifyUtils.makeRequest({ name, country_id: countryId });

  ctx.body = body;
  ctx.name = name;
  ctx.status = status;
  ctx.countryId = countryId;
});

Then("I expect the response body to contain the name, a count, age and country ID", async ({ ctx }) => {
  const { body, name, countryId } = ctx;

  expect(body).toMatchObject({
    name,
    count: expect.any(Number),
    age: expect.any(Number),
    country_id: countryId,
  });
});

Given("I call the Agify API with multiple names and a country code", async ({ agifyUtils, ctx }) => {
  const names = ["John", "Sarah"];
  const countryId = "GB";
  let params = "";

  for (const name of names) {
    params += `name[]=${name}&`;
  }

  params += `country_id=${countryId}`;

  const { status, body } = await agifyUtils.makeRequest(params);

  ctx.names = names;
  ctx.body = body;
  ctx.status = status;
  ctx.countryId = countryId;
});

Then("I expect the response body to contain a count, age and country ID for each name", async ({ ctx }) => {
  const expectedResponse = ctx.names.map((name) => ({
    name,
    count: expect.any(Number),
    age: expect.any(Number),
    country_id: ctx.countryId,
  }));

  expect(ctx.body).toMatchObject(expectedResponse);
});

Given("I call the Agify API with an invalid name string", async ({ agifyUtils, ctx }) => {
  const invalidString = chance.string().replace(/[?&/%]/g, "");
  const { body, status } = await agifyUtils.makeRequest({ name: invalidString });

  ctx.name = invalidString;
  ctx.body = body;
  ctx.status = status;
});

Then("I expect the response body to contain count: 0 and age: null", async ({ ctx }) => {
  const { body, name } = ctx;

  expect(body).toMatchObject({
    name,
    count: 0,
    age: null,
  });
});

Given("I call the Agify API with an empty name parameter", async ({ agifyUtils, ctx }) => {
  const { body, status } = await agifyUtils.makeRequest({ name: "" });

  ctx.body = body;
  ctx.status = status;
  ctx.name = "";
});

Given("I call the Agify API without a name parameter", async ({ agifyUtils, ctx }) => {
  const { body, status } = await agifyUtils.makeRequest();

  ctx.body = body;
  ctx.status = status;
});

Given("I call the Agify API with an unknown parameter", async ({ agifyUtils, ctx }) => {
  const key = chance.word();
  const value = chance.word();
  const { body, status } = await agifyUtils.makeRequest({ [key]: value });

  ctx.body = body;
  ctx.status = status;
});

Then(`I expect the error message to contain {string}`, async ({ ctx }, errorMessage: string) => {
  if (typeof ctx.body === "string") {
    expect(ctx.body).toEqual(errorMessage);
  } else {
    expect(ctx.body).toMatchObject({
      error: errorMessage,
    });
  }
});

Given("I call the Agify API with the {word} method", async ({ agifyUtils, ctx }, method: Method) => {
  const name = chance.first();
  const { body, status } = await agifyUtils.makeRequest({ name }, method, false);

  ctx.body = body;
  ctx.status = status;
});

Given("I call the Agify API with an invalid API key", async ({ agifyUtils, ctx }) => {
  const name = chance.first();
  const apiKey = chance.string({ symbols: false });
  const { status, body } = await agifyUtils.makeRequest({ name, apikey: apiKey });

  ctx.body = body;
  ctx.status = status;
});
