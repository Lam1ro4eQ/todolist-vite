import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .email()
    .min(3, { message: "минимальное значение 3 символа" })
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, { message: "невалидный email" }),
  password: z.string(),
  rememberMe: z.boolean(),
})

export type Inputs = z.infer<typeof loginSchema>
