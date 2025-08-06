import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import styles from "./Login.module.css"
import { LoginInputs, loginSchema } from "@/features/auth/lib/schemas/loginSchema.ts"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppDispatch } from "@/common/hooks"
import { useLoginMutation } from "@/features/auth/api/authApi.ts"
import { ResultCode } from "@/common/enums"
import { setIsLoggedIn } from "@/app/app-slice.ts"
import { AUTH_TOKEN } from "@/common/constants"

export const Login = () => {
  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    defaultValues: { email: "", password: "", rememberMe: false },
    resolver: zodResolver(loginSchema),
  })

  const [LoginMutation] = useLoginMutation()

  const dispatch = useAppDispatch()
  const onSubmit: SubmitHandler<LoginInputs> = (data) => {
    LoginMutation(data).then((res) => {
      if (res.data?.resultCode === ResultCode.Success) {
        localStorage.setItem(AUTH_TOKEN, res.data.data.token)
        dispatch(setIsLoggedIn({ isLoggedIn: true }))
      }
      // dispatch(loginTC(data))
      reset()
    })
  }

  return (
    <Grid container justifyContent={"center"}>
      <FormControl>
        <FormLabel>
          <p>or use common test account credentials:</p>
          <p>
            <b>Email:</b> free@samuraijs.com
          </p>
          <p>
            <b>Password:</b> free
          </p>
        </FormLabel>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <TextField label="Email" margin="normal" error={!!errors.email} {...register("email")} />
            {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
            <TextField
              error={!!errors.password}
              type="password"
              label="Password"
              margin="normal"
              {...register("password")}
            />
            {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}
            <FormControlLabel
              label="Remember me"
              control={
                <Controller
                  name={"rememberMe"}
                  control={control}
                  render={({ field: { value, ...rest } }) => <Checkbox {...rest} checked={value} />}
                />
              }
            />
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </FormGroup>
        </form>
      </FormControl>
    </Grid>
  )
}
