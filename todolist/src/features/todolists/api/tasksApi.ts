import { instance } from "@/common/instance"
import type { BaseResponse } from "@/common/types"
import type { DomainTask, GetTasksResponse, UpdateTaskModel } from "./tasksApi.types"
import { baseApi } from "@/app/baseApi.ts"
import { error } from "console"

export const _tasksApi = {
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`/todo-lists/${todolistId}/tasks`)
  },
  createTask(payload: { todolistId: string; title: string }) {
    const { todolistId, title } = payload
    return instance.post<BaseResponse<{ item: DomainTask }>>(`/todo-lists/${todolistId}/tasks`, { title })
  },
  updateTask(payload: { todolistId: string; taskId: string; model: Partial<UpdateTaskModel> }) {
    const { todolistId, taskId, model } = payload
    return instance.put<BaseResponse<{ item: DomainTask }>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
  deleteTask(payload: { todolistId: string; taskId: string }) {
    const { todolistId, taskId } = payload
    return instance.delete<BaseResponse>(`/todo-lists/${todolistId}/tasks/${taskId}`)
  },
}

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<GetTasksResponse, string>({
      query: (todolistId) => {
        return {
          method: "GET",
          url: `/todo-lists/${todolistId}/tasks`,
        }
      },
      providesTags: (result, _error, _arg, _meta) => {
        return result ? [...result.items.map((task) => ({ type: "Task", id: task.id }) as const)] : ["Task"]
      },
    }),
    createTask: build.mutation<BaseResponse<{ item: DomainTask }>, { todolistId: string; title: string }>({
      query: ({ todolistId, title }) => {
        return {
          method: "POST",
          url: `/todo-lists/${todolistId}/tasks`,
          body: { title },
        }
      },
      invalidatesTags: (result, _error) => {
        return [{ type: "Task", id: result?.data.item.id }]
      },
    }),
    updateTask: build.mutation<
      BaseResponse<{ item: DomainTask }>,
      { todolistId: string; taskId: string; model: Partial<UpdateTaskModel> }
    >({
      query: ({ todolistId, taskId, model }) => {
        return {
          method: "PUT",
          url: `/todo-lists/${todolistId}/tasks/${taskId}`,
          body: model,
        }
      },
      invalidatesTags: (_result, _error, { taskId }) => [{ type: "Task", id: taskId }],
    }),
    deleteTask: build.mutation<BaseResponse, { todolistId: string; taskId: string }>({
      query: ({ todolistId, taskId }) => {
        return {
          method: "delete",
          url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        }
      },
      invalidatesTags: (_result, _error, { taskId }) => [{ type: "Task", id: taskId }],
    }),
  }),
})

export const { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = tasksApi
