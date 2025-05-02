import { createTodolistTC, deleteTodolistTC } from "./todolists-slice"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { createAppSlice } from "@/common/utils"
import { DomainTask, type UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"

//структура стейта
// {
//   'todoId1': [{id:'1', title: 'a'},{id:'11', title: 'aa'},{id:'1', title: 'a'}],
//   'todoId2': [{id:'10', title: 'aa'},{id:'111', title: 'aw'},{id:'1', title: 'a'}]
// }

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  reducers: (create) => ({
    fetchTasks: create.asyncThunk(
      async (todolistId: string, thunkAPI) => {
        try {
          const res = await tasksApi.getTasks(todolistId)
          return { tasks: res.data.items, todolistId }
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] = action.payload.tasks
        },
      },
    ),

    createTaskTC: create.asyncThunk(
      async ({ todolistId, title }: { todolistId: string; title: string }, thunkAPI) => {
        try {
          const res = await tasksApi.createTask({ todolistId, title })
          return { task: res.data.data.item }
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.task.todoListId].unshift(action.payload.task)
        },
      },
    ),

    deleteTask: create.asyncThunk(
      async (arg: { todolistId: string; taskId: string }, thunkAPI) => {
        try {
          await tasksApi.deleteTask(arg)
          return { arg }
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const tasks = state[action.payload.arg.todolistId]
          const index = tasks.findIndex((task) => task.id === action.payload.arg.taskId)
          if (index !== -1) {
            tasks.splice(index, 1)
          }
        },
      },
    ),

    changeTaskStatus: create.asyncThunk(
      async (task: DomainTask, { rejectWithValue }) => {
        const model: UpdateTaskModel = {
          description: task.description,
          title: task.title,
          priority: task.priority,
          startDate: task.startDate,
          deadline: task.deadline,
          status: task.status,
        }

        try {
          const res = await tasksApi.updateTask({ todolistId: task.todoListId, taskId: task.id, model })
          return res.data.data.item
        } catch (error) {
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const task = state[action.payload.todoListId].find((task) => task.id === action.payload.id)
          if (task) {
            task.status = action.payload.status
          }
        },
      },
    ),

    changeTaskTitleAC: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, action) => {
      const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
      if (task) {
        task.title = action.payload.title
      }
    }),
  }),

  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  },
})

export type TasksState = Record<string, DomainTask[]>

export const { deleteTask, changeTaskStatus, changeTaskTitleAC, createTaskTC, fetchTasks } = tasksSlice.actions

export const tasksReducer = tasksSlice.reducer
// export const selectTasks = tasksSlice.selectors;
