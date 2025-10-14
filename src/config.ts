import { z } from "zod";

export const envSchema = z.object({
  BASE_URL: z.string().min(1, "BASE_URL is required"),
});

export type Env = z.infer<typeof envSchema>;
export const config = envSchema.parse(process.env);
