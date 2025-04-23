import { createAsyncThunk, createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"

export type FilterValues = "all" | "active" | "completed"

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => ({
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolostsTC.fulfilled, (_state, action) => {
        return action.payload.todolists.map((todo) => {
          return { ...todo, filter: "all" }
        })
      })
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) state[index].title = action.payload.title
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) state.splice(index, 1)
      })
  },
})

export const { changeTodolistFilterAC, createTodolistAC } = todolistsSlice.actions

export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors

//Thunk

export const fetchTodolostsTC = createAsyncThunk(`${todolistsSlice.name}/fetchTodolostsTC`, async (_arg, { rejectWithValue }) => {
  try {
    const res = await todolistsApi.getTodolists()
    return { todolists: res.data }
  } catch (error) {
    return rejectWithValue(null)
  }
})

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
