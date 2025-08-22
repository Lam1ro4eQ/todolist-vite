import { createTodolist, deleteTodolist, resetTodolists } from "./todolists-slice"
import { _tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { createAppSlice, handleAppError, handleServerNetworkError } from "@/common/utils"
import { DomainTask, domainTaskSchema, type UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
import { changeStatusAC } from "@/app/app-slice.ts"
import { RootState } from "@/app/store.ts"
import { ResultCode } from "@/common/enums"

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
          thunkAPI.dispatch(changeStatusAC({ status: "loading" }))
          const res = await _tasksApi.getTasks(todolistId)
          domainTaskSchema.array().parse(res.data.items)
          thunkAPI.dispatch(changeStatusAC({ status: "succeeded" }))
          return { todolistId, tasks: res.data.items }
        } catch (error) {
          handleServerNetworkError(error, thunkAPI.dispatch)
          console.log(error)
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
          thunkAPI.dispatch(changeStatusAC({ status: "loading" }))
          const res = await _tasksApi.createTask({ todolistId, title })
          if (res.data.resultCode === ResultCode.Success) {
            thunkAPI.dispatch(changeStatusAC({ status: "succeeded" }))
            return { task: res.data.data.item }
          } else {
            handleAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(null)
          }
        } catch (error) {
          handleServerNetworkError(error, thunkAPI.dispatch)
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
          await _tasksApi.deleteTask(arg)
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

    updateTask: create.asyncThunk(
      async (
        payload: {
          todolistId: string
          taskId: string
          domainModel: Partial<UpdateTaskModel>
        },
        thunkAPI,
      ) => {
        const { todolistId, taskId, domainModel } = payload

        const allTodolistTasks = (thunkAPI.getState() as RootState).tasks[todolistId]
        const task = allTodolistTasks.find((task) => task.id === taskId)

        if (!task) {
          return thunkAPI.rejectWithValue(null)
        }

        const model: UpdateTaskModel = {
          description: task.description,
          title: task.title,
          priority: task.priority,
          startDate: task.startDate,
          deadline: task.deadline,
          status: task.status,
          ...domainModel,
        }

        try {
          thunkAPI.dispatch(changeStatusAC({ status: "loading" }))
          const res = await _tasksApi.updateTask({ todolistId, taskId, model })
          thunkAPI.dispatch(changeStatusAC({ status: "succeeded" }))
          return { task: res.data.data.item }
        } catch (error) {
          thunkAPI.dispatch(changeStatusAC({ status: "failed" }))
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const allTodolistTasks = state[action.payload.task.todoListId]
          const taskIndex = allTodolistTasks.findIndex((task) => task.id === action.payload.task.id)
          if (taskIndex !== -1) {
            allTodolistTasks[taskIndex] = action.payload.task
          }
        },
      },
    ),
  }),

  extraReducers: (builder) => {
    builder
      .addCase(createTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(deleteTodolist.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
      .addCase(resetTodolists, (_state, _action) => {
        return {}
      })
  },
})

export type TasksState = Record<string, DomainTask[]>

export const { deleteTask, createTaskTC, fetchTasks, updateTask } = tasksSlice.actions

export const tasksReducer = tasksSlice.reducer
// export const selectTasks = tasksSlice.selectors;
