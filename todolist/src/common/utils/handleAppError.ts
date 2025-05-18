import { changeErrorAC, changeStatusAC } from "@/app/app-slice.ts"
import { Dispatch } from "@reduxjs/toolkit"
import { BaseResponse } from "@/common/types"

// BaseResponse<{ item: DomainTask }>
// BaseResponse<{ item: Todolist }>

export const handleAppError = <T>(data: BaseResponse<T>, dispatch: Dispatch) => {
  dispatch(changeErrorAC({ error: data.messages.length ? data.messages[0] : "Some error occurred" }))
  dispatch(changeStatusAC({ status: "failed" }))
}
