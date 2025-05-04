import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { createAppSlice } from "@/common/utils"
import { changeStatusAC } from "@/app/app-slice.ts"

export type FilterValues = "all" | "active" | "completed"

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => ({
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) todolist.filter = action.payload.filter
    }),
    fetchTodolistsTC: create.asyncThunk(
      async (_arg, thunkAPI) => {
        try {
          thunkAPI.dispatch(changeStatusAC({ status: "loading" }))
          const res = await todolistsApi.getTodolists()
          thunkAPI.rejectWithValue(null)
          return { todolists: res.data }
        } finally {
          thunkAPI.dispatch(changeStatusAC({ status: "idle" }))
        }
      },
      {
        fulfilled: (_state, action) => {
          return action.payload.todolists.map((todo) => {
            return { ...todo, filter: "all" }
          })
        },
      },
    ),
    changeTodolistTitle: create.asyncThunk(
      async (arg: { id: string; title: string }, thunkAPI) => {
        try {
          thunkAPI.dispatch(changeStatusAC({ status: "loading" }))
          await todolistsApi.changeTodolistTitle(arg)
          return arg
        } catch (error) {
          thunkAPI.dispatch(changeStatusAC({ status: "failed" }))
          return thunkAPI.rejectWithValue(null)
        } finally {
          thunkAPI.dispatch(changeStatusAC({ status: "idle" }))
        }
      },

      {
        fulfilled: (state, action) => {
          const index = state.findIndex((todolist) => todolist.id === action.payload.id)
          if (index !== -1) state[index].title = action.payload.title
        },
      },
    ),
    createTodolist: create.asyncThunk(
      async (title: string, thunkAPI) => {
        try {
          const res = await todolistsApi.createTodolist(title)
          const newTodolist: DomainTodolist = {
            id: res.data.data.item.id,
            title: res.data.data.item.title,
            addedDate: res.data.data.item.addedDate,
            order: res.data.data.item.order,
            filter: "all",
          }
          return newTodolist
        } catch (error) {
          thunkAPI.dispatch(changeStatusAC({ status: "failed" }))
          return thunkAPI.rejectWithValue(null)
        } finally {
          thunkAPI.dispatch(changeStatusAC({ status: "idle" }))
        }
      },
      {
        fulfilled: (state, action) => {
          state.unshift(action.payload)
        },
      },
    ),
    deleteTodolist: create.asyncThunk(
      async (arg: { id: string }, thunkAPI) => {
        try {
          await todolistsApi.deleteTodolist(arg.id)
          return arg
        } catch (error) {
          thunkAPI.dispatch(changeStatusAC({ status: "failed" }))
          return thunkAPI.rejectWithValue(null)
        } finally {
          thunkAPI.dispatch(changeStatusAC({ status: "idle" }))
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex((todolist) => todolist.id === action.payload.id)
          if (index !== -1) state.splice(index, 1)
        },
      },
    ),
  }),
  selectors: {
    selectTodolists: (state) => state,
  },
})

export const { changeTodolistFilterAC, fetchTodolistsTC, changeTodolistTitle, createTodolist, deleteTodolist } = todolistsSlice.actions

export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors
