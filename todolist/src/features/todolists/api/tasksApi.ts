import { instance } from "@/common/instance"
import type { BaseResponse } from "@/common/types"
import type { DomainTask, GetTasksResponse, UpdateTaskModel } from "./tasksApi.types"
import { baseApi } from "@/app/baseApi.ts"
import { error } from "console"
import { PAGE_SIZE } from "@/common/constants"

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
    getTasks: build.query<GetTasksResponse, { id: string; params: { page: number } }>({
      query: ({ id, params }) => {
        return {
          method: "GET",
          url: `/todo-lists/${id}/tasks`,
          params: { ...params, count: PAGE_SIZE },
        }
      },
      providesTags: (_result, _error, { id }, _meta) => [{ type: "Task", id }],
    }),
    createTask: build.mutation<BaseResponse<{ item: DomainTask }>, { todolistId: string; title: string }>({
      query: ({ todolistId, title }) => {
        return {
          method: "POST",
          url: `/todo-lists/${todolistId}/tasks`,
          body: { title },
        }
      },
      invalidatesTags: (_result, _error, { todolistId }) => [{ type: "Task", id: todolistId }],
    }),
    updateTask: build.mutation<
      BaseResponse<{ item: DomainTask }>,
      { todolistId: string; taskId: string; model: Partial<UpdateTaskModel> }
    >({
      async onQueryStarted({ todolistId, taskId, model }, { queryFulfilled, dispatch, getState }) {
        const args = tasksApi.util.selectCachedArgsForQuery(getState(), "getTasks")
        let patchResults: any[] = []
        args.forEach(({ params }) => {
          patchResults.push(
            dispatch(
              tasksApi.util.updateQueryData("getTasks", { id: todolistId, params: { page: params.page } }, (state) => {
                const index = state.items.findIndex((task) => task.id === taskId)
                if (index !== -1) {
                  state.items[index] = { ...state.items[index], ...model }
                }
              }),
            ),
          )
        })
        try {
          await queryFulfilled
        } catch {
          patchResults.forEach((patchResult) => {
            patchResult.undo()
          })
        }
      },
      query: ({ todolistId, taskId, model }) => {
        return {
          method: "PUT",
          url: `/todo-lists/${todolistId}/tasks/${taskId}`,
          body: model,
        }
      },
      invalidatesTags: (_result, _error, { todolistId }) => [{ type: "Task", id: todolistId }],
    }),
    deleteTask: build.mutation<BaseResponse, { todolistId: string; taskId: string }>({
      query: ({ todolistId, taskId }) => {
        return {
          method: "delete",
          url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        }
      },
      invalidatesTags: (_result, _error, { todolistId }) => [{ type: "Task", id: todolistId }],
    }),
  }),
})

export const { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = tasksApi
