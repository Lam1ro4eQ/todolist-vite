import { createAppSlice, handleServerNetworkError } from "@/common/utils"
import { LoginInputs } from "@/features/auth/lib/schemas/loginSchema.ts"
import { changeStatusAC } from "@/app/app-slice.ts"
import { authApi } from "@/features/auth/api/authApi.ts"
import { AUTH_TOKEN } from "@/common/constants"

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
          localStorage.setItem(AUTH_TOKEN, res.data.data.token)
          // domainTaskSchema.array().parse(res.data)
          dispatch(changeStatusAC({ status: "succeeded" }))
          return { isLoggedIn: true }
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
          await authApi.logout()
          localStorage.removeItem(AUTH_TOKEN)
          dispatch(changeStatusAC({ status: "succeeded" }))
          return { isLoggedIn: false }
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
