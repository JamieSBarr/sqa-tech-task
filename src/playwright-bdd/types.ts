export type Method = "get" | "post" | "put" | "patch" | "delete";

export type SearchParams = Record<string, string> | string;

export interface Ctx {
  name: string;
  names: string[];
  body: Record<string, string> | string;
  status: number;
  countryId: string;
}
