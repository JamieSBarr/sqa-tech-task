import { Given, Then, Before, type IWorld, setDefaultTimeout } from "@cucumber/cucumber";
import { expect } from "chai";
import Chance from "chance";
import { AgifyUtils } from "../utils/agify-utils.ts";
import type { Method } from "../../types.ts";

setDefaultTimeout(10 * 1000);

const chance = new Chance();

interface CustomWorld extends IWorld {
  agifyUtils: AgifyUtils;
  name?: string;
  names?: string[];
  body?: any;
  status?: number;
  countryId?: string;
}

Before(function (this: CustomWorld) {
  this.agifyUtils = new AgifyUtils();
});

Given("I call the Agify API with a single name", async function (this: CustomWorld) {
  const name = chance.first();
  const { body, status } = await this.agifyUtils.makeRequest({ name });
  this.name = name;
  this.body = body;
  this.status = status;
});

Then("I expect a {int} status code", async function (this: CustomWorld, status: number) {
  expect(this.status).to.equal(status);
});

Then("I expect the response body to contain the name, a count and an age", async function (this: CustomWorld) {
  expect(this.body.name).to.equal(this.name);
  expect(this.body.count).to.be.a("number");
  expect(this.body.age).to.be.a("number");
});

Given("I call the Agify API with {int} names", async function (this: CustomWorld, numberOfNames: number) {
  let params = new URLSearchParams();
  const names: string[] = [];

  for (let i = 0; i < numberOfNames; i++) {
    const name = chance.first();
    names.push(name);
    params.append("name[]", name);
  }

  const { body, status } = await this.agifyUtils.makeRequest(params);

  this.names = names;
  this.body = body;
  this.status = status;
});

Then("I expect the response body to contain a count and age for each name", async function (this: CustomWorld) {
  expect(this.body).to.be.an("array").with.lengthOf(this.names!.length);

  this.body.forEach((item: any, index: number) => {
    expect(item.name).to.equal(this.names![index]);
    expect(item.count).to.be.a("number");
    expect(item.age).to.be.a("number");
  });
});

Given("I call the Agify API with a single name and country code", async function (this: CustomWorld) {
  const countryId = chance.pickone(["US", "GB", "CA", "AU"]);
  const name = chance.first({ nationality: "en" });

  const { body, status } = await this.agifyUtils.makeRequest({ name, country_id: countryId });

  this.body = body;
  this.name = name;
  this.status = status;
  this.countryId = countryId;
});

Then("I expect the response body to contain the name, a count, age and country ID", async function (this: CustomWorld) {
  expect(this.body.name).to.equal(this.name);
  expect(this.body.count).to.be.a("number");
  expect(this.body.age).to.be.a("number");
  expect(this.body.country_id).to.equal(this.countryId);
});

Given("I call the Agify API with multiple names and a country code", async function (this: CustomWorld) {
  const names = ["John", "Sarah"];
  const countryId = "GB";
  let params = new URLSearchParams();

  for (const name of names) {
    params.append("name[]", name);
  }

  params.append("country_id", countryId);

  const { status, body } = await this.agifyUtils.makeRequest(params);

  this.names = names;
  this.body = body;
  this.status = status;
  this.countryId = countryId;
});

Then(
  "I expect the response body to contain a count, age and country ID for each name",
  async function (this: CustomWorld) {
    expect(this.body).to.be.an("array").with.lengthOf(this.names!.length);

    this.body.forEach((item: any, index: number) => {
      expect(item.name).to.equal(this.names![index]);
      expect(item.count).to.be.a("number");
      expect(item.age).to.be.a("number");
      expect(item.country_id).to.equal(this.countryId);
    });
  }
);

Given("I call the Agify API with an invalid name string", async function (this: CustomWorld) {
  const invalidString = chance.string().replace(/[?&/%]/g, "");
  const { body, status } = await this.agifyUtils.makeRequest({ name: invalidString });

  this.name = invalidString;
  this.body = body;
  this.status = status;
});

Then("I expect the response body to contain count: 0 and age: null", async function (this: CustomWorld) {
  expect(this.body.name).to.equal(this.name);
  expect(this.body.count).to.equal(0);
  expect(this.body.age).to.be.null;
});

Given("I call the Agify API with an empty name parameter", async function (this: CustomWorld) {
  const { body, status } = await this.agifyUtils.makeRequest({ name: "" });

  this.body = body;
  this.status = status;
  this.name = "";
});

Given("I call the Agify API without a name parameter", async function (this: CustomWorld) {
  const { body, status } = await this.agifyUtils.makeRequest({});

  this.body = body;
  this.status = status;
});

Given("I call the Agify API with an unknown parameter", async function (this: CustomWorld) {
  const key = chance.word();
  const value = chance.word();

  const { body, status } = await this.agifyUtils.makeRequest({ [key]: value });

  this.body = body;
  this.status = status;
});

Then("I expect the error message to contain {string}", async function (this: CustomWorld, errorMessage: string) {
  if (typeof this.body === "string") {
    expect(this.body).to.equal(errorMessage);
  } else {
    expect(this.body).to.have.property("error", errorMessage);
  }
});

Given("I call the Agify API with the {word} method", async function (this: CustomWorld, method: Method) {
  const name = chance.first();

  const { body, status } = await this.agifyUtils.makeRequest({ name }, method);

  this.body = body;
  this.status = status;
});

Given("I call the Agify API with an invalid API key", async function (this: CustomWorld) {
  const name = chance.first();
  const apiKey = chance.string({ symbols: false });

  const { body, status } = await this.agifyUtils.makeRequest({ name, apikey: apiKey });

  this.body = body;
  this.status = status;
});
