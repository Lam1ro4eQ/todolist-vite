import s from "./App.module.css"
import { Header } from "@/common/components/Header/Header"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { selectThemeMode, setIsLoggedIn } from "@/app/app-slice.ts"
import { ErrorSnackbar } from "@/common/components/ErrorSnackbar/ErrorSnackbar.tsx"
import { Routing } from "@/common/routing/Routing.tsx"
import { useEffect, useState } from "react"
import { CircularProgress } from "@mui/material"
import { useMeQuery } from "@/features/auth/api/authApi.ts"
import { ResultCode } from "@/common/enums"

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)

  const theme = getTheme(themeMode)
  const dispatch = useAppDispatch()
  const [isInitialized, setIsInitialized] = useState(false)

  const { data, isLoading } = useMeQuery()

  useEffect(() => {
    if (isLoading) return
    setIsInitialized(true)
    if (data?.resultCode === ResultCode.Success) dispatch(setIsLoggedIn({ isLoggedIn: true }))
  }, [isLoading, data])

  if (!isInitialized) {
    return (
      <div className={s.circularProgressContainer}>
        <CircularProgress size={150} thickness={3} />
      </div>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={s.app}>
        <CssBaseline />
        <Header />
        <Routing />
        <ErrorSnackbar />
      </div>
    </ThemeProvider>
  )
}
