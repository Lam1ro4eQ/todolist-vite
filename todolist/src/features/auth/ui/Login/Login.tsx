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
import { loginTC, selectIsLoggedIn } from "@/features/auth/model/auth-slice.ts"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { Navigate, useNavigate } from "react-router"
import { Path } from "@/common/routing/Routing"

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

  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<LoginInputs> = (data) => {
    dispatch(loginTC(data))
    reset()
  }

  // 1 вариает
  if (isLoggedIn) {
    return <Navigate to={Path.Main} />
  }

  // 2 вариает
  // useEffect(() => {}, [isLoggedIn])
  // if (isLoggedIn) {
  //   navigate(Path.Main)
  // }

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
