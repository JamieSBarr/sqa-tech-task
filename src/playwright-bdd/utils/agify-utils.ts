import type { APIRequestContext } from "@playwright/test";
import type { Method, SearchParams } from "../types.ts";

export class AgifyUtils {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async makeRequest(params: SearchParams = {}, method: Method = "get", expectJson = true) {
    const response = await this.request[method]("https://api.agify.io", { params });

    const body = expectJson ? await response.json() : await response.text();
    const status = response.status();

    return {
      body,
      status,
    };
  }
}
