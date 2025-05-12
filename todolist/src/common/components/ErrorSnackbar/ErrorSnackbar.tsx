import { Alert } from "@mui/material"
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar"
import { SyntheticEvent } from "react"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { changeErrorAC, selectError } from "@/app/app-slice.ts"

export const ErrorSnackbar = () => {
  const error = useAppSelector(selectError)
  const dispatch = useAppDispatch()

  const handleClose = (_event?: SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return
    }
    dispatch(changeErrorAC({ error: null }))
  }

  return (
    <div>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" variant="filled" color="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  )
}
