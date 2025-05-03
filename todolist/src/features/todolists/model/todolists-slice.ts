import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
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
          thunkAPI.dispatch(changeStatusAC({ status: "idle" }))
          return { todolists: res.data }
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
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
  }),
  selectors: {
    selectTodolists: (state) => state,
  },
  extraReducers: (builder) => {
    builder

      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) state[index].title = action.payload.title
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) state.splice(index, 1)
      })
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state.unshift(action.payload)
      })
  },
})

export const { changeTodolistFilterAC, fetchTodolistsTC } = todolistsSlice.actions

export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors

//Thunk

export const changeTodolistTitleTC = createAsyncThunk(
  `${todolistsSlice.name}/changeTodolistTitleTC`,
  async (arg: { id: string; title: string }, { rejectWithValue }) => {
    try {
      await todolistsApi.changeTodolistTitle(arg)
      return arg
    } catch (error) {
      return rejectWithValue(null)
    }
  },
)

export const deleteTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/deleteTodolistTC`,
  async (arg: { id: string }, { rejectWithValue }) => {
    try {
      await todolistsApi.deleteTodolist(arg.id)
      return { id: arg.id }
    } catch (error) {
      return rejectWithValue(null)
    }
  },
)

export const createTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/createTodolistTC`,
  async (title: string, { rejectWithValue, dispatch }) => {
    try {
      dispatch(changeStatusAC({ status: "loading" }))
      const res = await todolistsApi.createTodolist(title)
      const newTodolist: DomainTodolist = {
        id: res.data.data.item.id,
        title: res.data.data.item.title,
        addedDate: res.data.data.item.addedDate,
        order: res.data.data.item.order,
        filter: "all",
      }
      dispatch(changeStatusAC({ status: "idle" }))
      return newTodolist
    } catch (error) {
      return rejectWithValue(null)
    }
  },
)
