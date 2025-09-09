import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { AUTH_TOKEN } from "@/common/constants"
import { changeErrorAC } from "@/app/app-slice.ts"
import { isErrorWithMessage } from "@/common/utils/isErrorWithMessage.ts"

export const baseApi = createApi({
  reducerPath: "todolistsApi",
  tagTypes: ["Todolist", "Task"],
  baseQuery: async (args, api, extraOptions) => {
    // await new Promise((resolve) => setTimeout(resolve, 2000))

    const res = await fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      prepareHeaders: (headers) => {
        headers.set("API-KEY", import.meta.env.VITE_API_KEY)
        headers.set("Authorization", `Bearer ${localStorage.getItem(AUTH_TOKEN)}`)
      },
    })(args, api, extraOptions)

    if (res.error) {
      if (
        res.error.status === "FETCH_ERROR" ||
        res.error.status === "TIMEOUT_ERROR" ||
        res.error.status === "CUSTOM_ERROR"
      ) {
        api.dispatch(changeErrorAC({ error: res.error.error }))
      }
      if (res.error.status === "PARSING_ERROR") {
        api.dispatch(changeErrorAC({ error: "ошибка парсинга. Свяжитесь с тех поддержкой" }))
      }
      if (res.error.status === 403) {
        api.dispatch(changeErrorAC({ error: "Ошибка авторизации. Проверьте api-key" }))
      }
      if (res.error.status === 400) {
        //type assertion
        //api.dispatch(changeErrorAC({ error: (res.error.data as { message: string }).message }))
        // JSON stringify
        //api.dispatch(changeErrorAC({ error: JSON.stringify(res.error.data) || "Some error occurred" }))
        // type predicate / guard
        if (isErrorWithMessage(res.error.data)) {
          api.dispatch(changeErrorAC({ error: res.error.data.message }))
        } else {
          api.dispatch(changeErrorAC({ error: JSON.stringify(res.error) }))
        }
      }
    }
    return res
  },

  endpoints: () => ({}),
})
