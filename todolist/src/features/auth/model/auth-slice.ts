import { createAppSlice, handleAppError, handleServerNetworkError } from "@/common/utils"
import { LoginInputs } from "@/features/auth/lib/schemas/loginSchema.ts"
import { changeStatusAC } from "@/app/app-slice.ts"
import { authApi } from "@/features/auth/api/authApi.ts"
import { AUTH_TOKEN } from "@/common/constants"
import { ResultCode } from "@/common/enums"

export const authSlice = createAppSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  selectors: {
    selectIsLoggedIn: (state) => state.isLoggedIn,
  },
  reducers: (create) => ({
    loginTC: create.asyncThunk(
      async (data: LoginInputs, { dispatch, rejectWithValue }) => {
        try {
          dispatch(changeStatusAC({ status: "loading" }))
          const res = await authApi.login(data)
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(changeStatusAC({ status: "succeeded" }))
            localStorage.setItem(AUTH_TOKEN, res.data.data.token)
            return { isLoggedIn: true }
          } else {
            handleAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleServerNetworkError(error, dispatch)
          console.log(error)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
        },
      },
    ),
    logoutTC: create.asyncThunk(
      async (_, { dispatch, rejectWithValue }) => {
        try {
          dispatch(changeStatusAC({ status: "loading" }))
          const res = await authApi.logout()
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(changeStatusAC({ status: "succeeded" }))
            localStorage.removeItem(AUTH_TOKEN)
            return { isLoggedIn: false }
          } else {
            handleAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleServerNetworkError(error, dispatch)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
        },
      },
    ),
    meTC: create.asyncThunk(
      async (_, { dispatch, rejectWithValue }) => {
        try {
          dispatch(changeStatusAC({ status: "loading" }))
          const res = await authApi.me()
          if (res.data.resultCode === ResultCode.Success) {
            return { isLoggedIn: true }
            dispatch(changeStatusAC({ status: "succeeded" }))
          } else {
            handleAppError(res.data, dispatch)
            return rejectWithValue(null)
            dispatch(changeStatusAC({ status: "failed" }))
          }
        } catch (error) {
          handleServerNetworkError(error, dispatch)
          console.log(error)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
        },
      },
    ),
  }),
})

export const { selectIsLoggedIn } = authSlice.selectors
export const { loginTC, logoutTC } = authSlice.actions
export const authReducer = authSlice.reducer
