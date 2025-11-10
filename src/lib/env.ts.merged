import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_NAVBAR_VARIANT: z
    .enum(["minimal","brandCenter","glassGradient","mega","ecommerce"])
    .optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

export const env = envSchema.parse(process.env);
