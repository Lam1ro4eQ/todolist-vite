import { z } from "zod"

export type _Todolist = {
  id: string
  title: string
  addedDate: string
  order: number
}

export const todolistSchema = z.object({
  id: z.string(),
  title: z.string(),
  addedDate: z.string(),
  order: z.number(),
})

export type Todolist = z.infer<typeof todolistSchema>
