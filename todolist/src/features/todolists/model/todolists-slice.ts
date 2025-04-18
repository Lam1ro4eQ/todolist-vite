import { createSlice, nanoid } from "@reduxjs/toolkit"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"

export type FilterValues = "all" | "active" | "completed"

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => ({
    fetchTodolistsAC: create.reducer<{ todolists: Todolist[] }>((_state, action) => {
      return action.payload.todolists.map((todo) => {
        return { ...todo, filter: "all" }
      })
    }),
    deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) state.splice(index, 1)
    }),
    changeTodolistTitleAC: create.reducer<{ id: string; title: string }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) state[index].title = action.payload.title
    }),
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) todolist.filter = action.payload.filter
    }),
    createTodolistAC: create.preparedReducer(
      (title: string) => ({
        payload: { title, id: nanoid() },
      }),
      (state, action) => {
        const newTodolist: DomainTodolist = {
          ...action.payload,
          filter: "all",
          addedDate: "1",
          order: 1,
        }
        state.push(newTodolist)
      },
    ),
  }),
  selectors: {
    selectTodolists: (state) => state,
  },
})

export const { deleteTodolistAC, changeTodolistTitleAC, changeTodolistFilterAC, createTodolistAC, fetchTodolistsAC } =
  todolistsSlice.actions

export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors
