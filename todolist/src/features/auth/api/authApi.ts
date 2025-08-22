import type { BaseResponse } from "@/common/types"
import { LoginInputs } from "@/features/auth/lib/schemas/loginSchema.ts"
import { baseApi } from "@/app/baseApi.ts"

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
