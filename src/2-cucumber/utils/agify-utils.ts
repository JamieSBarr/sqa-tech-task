import type { Method, SearchParams } from "../../types.ts";
import axios from "axios";
import { config } from "../../config.ts";

export class AgifyUtils {
  async makeRequest(params: SearchParams, method: Method = "get") {
    try {
      const response = await axios({
        url: config.BASE_URL,
        params,
        method,
      });

      const body = response.data;
      const status = response.status;

      return {
        body,
        status,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return {
          body: error.response.data,
          status: error.response.status,
        };
      } else {
        throw new Error(`Request failed:\n${error}`);
      }
    }
  }
}
