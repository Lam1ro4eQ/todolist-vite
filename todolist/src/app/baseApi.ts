import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { AUTH_TOKEN } from "@/common/constants"
import { isErrorWithMessage } from "@/common/utils/isErrorWithMessage.ts"
import { changeErrorAC } from "./app-slice"
import { ResultCode } from "@/common/enums/enums"

export const baseApi = createApi({
  reducerPath: "todolistsApi",
  tagTypes: ["Todolist", "Task"],
  baseQuery: async (args, api, extraOptions) => {
    // await new Promise((resolve) => setTimeout(resolve, 2000))

    const result = await fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      prepareHeaders: (headers) => {
        headers.set("API-KEY", import.meta.env.VITE_API_KEY)
        headers.set("Authorization", `Bearer ${localStorage.getItem(AUTH_TOKEN)}`)
      },
    })(args, api, extraOptions)

    let error = "Some error occurred"

    if (result.error) {
      switch (result.error.status) {
        case "FETCH_ERROR":
        case "PARSING_ERROR":
        case "CUSTOM_ERROR":
          error = result.error.error
          break
        case "TIMEOUT_ERROR":
          error = "Ошибка парсинга. Свяжитесь с тех поддержкой"
          break
        case 403:
          error = "403 Forbidden Error. Check API-KEY"
          break
        case 400:
          if (isErrorWithMessage(result.error.data)) {
            error = result.error.data.message
          } else {
            error = JSON.stringify(result.error.data)
          }
          break
        default:
          if (result.error.status >= 500 && result.error.status < 600) {
            error = "Server error occurred. Please try again later."
          } else {
            error = JSON.stringify(result.error)
          }
          break
      }
      api.dispatch(changeErrorAC({ error }))
    }

    // 2. Result code errors
    if ((result.data as { resultCode: ResultCode }).resultCode === ResultCode.Error) {
      const messages = (result.data as { messages: string[] }).messages
      error = messages.length ? messages[0] : error
      api.dispatch(changeErrorAC({ error }))
    }
    return result

    // if (res.error) {
    //   if (
    //     res.error.status === "FETCH_ERROR" ||
    //     res.error.status === "TIMEOUT_ERROR" ||
    //     res.error.status === "CUSTOM_ERROR"
    //   ) {
    //     api.dispatch(changeErrorAC({ error: res.error.error }))
    //   }
    //   if (res.error.status === "PARSING_ERROR") {
    //     api.dispatch(changeErrorAC({ error: "ошибка парсинга. Свяжитесь с тех поддержкой" }))
    //   }
    //   if (res.error.status === 403) {
    //     api.dispatch(changeErrorAC({ error: "Ошибка авторизации. Проверьте api-key" }))
    //   }
    //   if (res.error.status === 400 || res.error.status === 500) {
    //     //type assertion
    //     //api.dispatch(changeErrorAC({ error: (res.error.data as { message: string }).message }))
    //     // JSON stringify
    //     //api.dispatch(changeErrorAC({ error: JSON.stringify(res.error.data) || "Some error occurred" }))
    //     // type predicate / guard
    //     if (isErrorWithMessage(res.error.data)) {
    //       api.dispatch(changeErrorAC({ error: res.error.data.message }))
    //     } else {
    //       api.dispatch(changeErrorAC({ error: JSON.stringify(res.error) }))
    //     }
    //   }
    // }
  },

  endpoints: () => ({}),
})
