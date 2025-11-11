import { instance } from "@/common/instance"
import type { BaseResponse } from "@/common/types"
import type { Todolist } from "./todolistsApi.types"
import { baseApi } from "@/app/baseApi.ts"
import { DomainTodolist } from "../lib/types"

export const _todolistsApi = {
  getTodolists() {
    return instance.get<Todolist[]>("/todo-lists")
  },
  changeTodolistTitle(payload: { id: string; title: string }) {
    const { id, title } = payload
    return instance.put<BaseResponse>(`/todo-lists/${id}`, { title })
  },
  createTodolist(title: string) {
    return instance.post<BaseResponse<{ item: Todolist }>>("/todo-lists", { title })
  },
  deleteTodolist(id: string) {
    return instance.delete<BaseResponse>(`/todo-lists/${id}`)
  },
}

export const todolistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTodolists: build.query<DomainTodolist[], void>({
      query: () => {
        return {
          method: "GET",
          url: "/todo-lists",
        }
      },
      transformResponse: (todolists: Todolist[], _meta, _arg) => {
        return todolists.map((todo) => {
          return { ...todo, filter: "all", entityStatus: "idle" }
        })
      },
      providesTags: ["Todolist"],
    }),
    createTodolist: build.mutation<BaseResponse<{ item: Todolist }>, string>({
      query: (title) => {
        return {
          method: "post",
          url: "/todo-lists",
          body: { title },
        }
      },
      invalidatesTags: ["Todolist"],
    }),
    deleteTodolist: build.mutation<BaseResponse, string>({
      async onQueryStarted(id, { queryFulfilled, dispatch }) {
        const patchResult = dispatch(
          todolistsApi.util.updateQueryData("getTodolists", undefined, (data) => {
            const index = data.findIndex((todo) => todo.id === id)
            if (index != -1) data.splice(index, 1)
          }),
        )
        try {
          await queryFulfilled
        } catch (error) {
          patchResult.undo()
        }
      },
      query: (id) => {
        return {
          method: "delete",
          url: `/todo-lists/${id}`,
        }
      },
      invalidatesTags: ["Todolist"],
    }),
    changeTodolistTitle: build.mutation<BaseResponse, { id: string; title: string }>({
      query: ({ id, title }) => {
        return {
          method: "put",
          url: `/todo-lists/${id}`,
          body: { title },
        }
      },
      invalidatesTags: ["Todolist"],
    }),
  }),
})
export const {
  useGetTodolistsQuery,
  useCreateTodolistMutation,
  useDeleteTodolistMutation,
  useChangeTodolistTitleMutation,
} = todolistsApi
