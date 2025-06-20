import { instance } from "@/common/instance"
import type { BaseResponse } from "@/common/types"
import { LoginInputs } from "@/features/auth/lib/schemas/loginSchema.ts"

export const authApi = {
  login(args: LoginInputs) {
    return instance.post<BaseResponse<{ userId: number; token: string }>>(`/auth/login`, args)
  },
}
