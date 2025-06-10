import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, { message: "невалидный email" }),
  password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, { message: "невалидный password" }),
  rememberMe: z.boolean(),
})

export type LoginInputs = z.infer<typeof loginSchema>
