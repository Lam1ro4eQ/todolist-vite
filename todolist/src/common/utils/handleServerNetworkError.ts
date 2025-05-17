import { changeErrorAC, changeStatusAC } from "@/app/app-slice.ts"
import { Dispatch } from "@reduxjs/toolkit"
import axios from "axios"

export const handleServerNetworkError = (error: any, dispatch: Dispatch) => {
  let errorMessage = "Something went wrong"

  // 1. Аксиос ошибки
  if (axios.isAxiosError(error)) {
    errorMessage = error.response?.data?.message || error.message || errorMessage
  } else if (error instanceof Error) {
    // 2. Нативные ошибки
    errorMessage = error.message
  } else {
    errorMessage = JSON.stringify(error)
  }

  dispatch(changeErrorAC({ error: errorMessage }))
  dispatch(changeStatusAC({ status: "failed" }))
}
