import { instance } from "@/common/instance"
import type { BaseResponse } from "@/common/types"
import { LoginInputs } from "@/features/auth/lib/schemas/loginSchema.ts"
import { baseApi } from "@/app/baseApi.ts"

export const _authApi = {
  login(args: LoginInputs) {
    return instance.post<BaseResponse<{ userId: number; token: string }>>(`/auth/login`, args)
  },
  logout() {
    return instance.delete<BaseResponse>(`/auth/login`)
  },
  me() {
    return instance.get<BaseResponse<{ id: number; email: string; login: string }>>(`/auth/me`)
  },
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<BaseResponse<{ userId: number; token: string }>, LoginInputs>({
      query: (body) => ({ method: "POST", url: `/auth/login`, body }),
    }),
    logout: build.mutation<BaseResponse, void>({
      query: () => ({ method: "Delete", url: `/auth/login` }),
    }),
    me: build.query<BaseResponse<{ id: number; email: string; login: string }>, void>({
      query: () => ({ method: "get", url: `/auth/me` }),
    }),
  }),
})
export const { useMeQuery, useLoginMutation, useLogoutMutation } = authApi
