import { Todolist, todolistSchema } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { createAppSlice, handleAppError, handleServerNetworkError } from "@/common/utils"
import { changeStatusAC } from "@/app/app-slice.ts"
import { RequestStatus } from "@/common/types"
import { ResultCode } from "@/common/enums"

export type FilterValues = "all" | "active" | "completed"

export type DomainTodolist = Todolist & {
  filter: FilterValues
  entityStatus: RequestStatus
}

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => ({
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) todolist.filter = action.payload.filter
    }),
    changeTodolistEntityStatusAC: create.reducer<{ id: string; entityStatus: RequestStatus }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) todolist.entityStatus = action.payload.entityStatus
    }),
    fetchTodolistsTC: create.asyncThunk(
      async (_arg, thunkAPI) => {
        try {
          thunkAPI.dispatch(changeStatusAC({ status: "loading" }))
          const res = await todolistsApi.getTodolists()
          todolistSchema.array().parse(res.data)
          thunkAPI.rejectWithValue(null)
          return { todolists: res.data }
        } catch (error: any) {
          handleServerNetworkError(error, thunkAPI.dispatch)
          console.table(error)
          thunkAPI.dispatch(changeStatusAC({ status: "failed" }))
          return thunkAPI.rejectWithValue(null)
        } finally {
          thunkAPI.dispatch(changeStatusAC({ status: "idle" }))
        }
      },
      {
        fulfilled: (_state, action) => {
          return action.payload.todolists.map((todo) => {
            return { ...todo, filter: "all", entityStatus: "idle" }
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
      async (title: string, { dispatch, rejectWithValue }) => {
        try {
          dispatch(changeStatusAC({ status: "loading" }))
          const res = await todolistsApi.createTodolist(title)
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(changeStatusAC({ status: "succeeded" }))
            return { todolist: res.data.data.item }
          } else {
            handleAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (error: any) {
          handleServerNetworkError(error, dispatch)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
        },
      },
    ),
    deleteTodolist: create.asyncThunk(
      async (id: string, thunkAPI) => {
        try {
          thunkAPI.dispatch(changeTodolistEntityStatusAC({ entityStatus: "loading", id }))
          thunkAPI.dispatch(changeStatusAC({ status: "loading" }))
          await todolistsApi.deleteTodolist(id)
          return { id }
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

export const {
  changeTodolistFilterAC,
  fetchTodolistsTC,
  changeTodolistTitle,
  createTodolist,
  deleteTodolist,
  changeTodolistEntityStatusAC,
} = todolistsSlice.actions

export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors
