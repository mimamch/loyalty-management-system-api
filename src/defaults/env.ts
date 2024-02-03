import { config } from "dotenv";
config();
import { z } from "zod";

export const env = z
  .object({
    NODE_ENV: z.string().default("development"),
    PORT: z.string().default("5000"),
    DATABASE_URL: z.string(),
  })
  .parse(process.env);
export const isProduction = env.NODE_ENV === "production";
