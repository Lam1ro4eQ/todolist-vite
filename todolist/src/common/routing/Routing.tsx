import { Route, Routes } from "react-router"
import { Main } from "@/app/Main.tsx"
import { Login } from "@/features/auth/ui/Login/Login.tsx"
import { PageNotFound } from "@/common/components/PageNotFound/PageNotFound.tsx"
import { ProtectedRoute } from "@/common/components/ProtectedRoute/ProtectedRoute.tsx"
import { useAppSelector } from "@/common/hooks"
import { selectIsLoggedIn } from "@/features/auth/model/auth-slice.ts"

export const Path = {
  Main: "/",
  Login: "/login",
  Faq: "/faq",
  NotFound: "*",
} as const

export const Routing = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  return (
    <Routes>
      <Route element={<ProtectedRoute isAllowed={isLoggedIn} />}>
        <Route path={Path.Main} element={<Main />} />
        <Route path={Path.Faq} element={<h2>Faq</h2>} />
      </Route>
      <Route element={<ProtectedRoute isAllowed={!isLoggedIn} redirectPath={Path.Main} />}>
        <Route path={Path.Login} element={<Login />} />
      </Route>
      <Route path={Path.NotFound} element={<PageNotFound />} />
    </Routes>
  )
}

// <Route
//   path={Path.Main}
//   element={
//     <ProtectedRoute isAllowed={isLoggedIn}>
//       <Main />
//     </ProtectedRoute>
//   }
// />
//
// <Route
//   path={Path.Faq}
//   element={
//     <ProtectedRoute isAllowed={isLoggedIn}>
//       <h2>Faq</h2>
//     </ProtectedRoute>
//   }
// />
