import s from "./App.module.css"
import { Header } from "@/common/components/Header/Header"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { selectThemeMode } from "@/app/app-slice.ts"
import { ErrorSnackbar } from "@/common/components/ErrorSnackbar/ErrorSnackbar.tsx"
import { Routing } from "@/common/routing/Routing.tsx"
import { useEffect, useState } from "react"
import { meTC } from "@/features/auth/model/auth-slice.ts"
import { CircularProgress } from "@mui/material"

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)

  const theme = getTheme(themeMode)

  const dispatch = useAppDispatch()

  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    dispatch(meTC())
      .unwrap() // для обраболтки ошибки в rtk
      .then(() => {
        setIsInitialized(true)
      })
      .catch((err) => {
        setIsInitialized(true)
      })
  }) // раннее прерывание чтобы не отрисовывался лишний раз тот же логин

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
