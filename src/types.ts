export type Method = "get" | "post" | "put" | "patch" | "delete";

export type SearchParams = Record<string, string> | string | URLSearchParams;
