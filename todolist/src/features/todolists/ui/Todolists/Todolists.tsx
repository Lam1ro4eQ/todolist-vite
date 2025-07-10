import { TodolistItem } from "./TodolistItem/TodolistItem"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import { useGetTodolistsQuery } from "@/features/todolists/api/todolistsApi.ts"

export const Todolists = () => {
  const data = useGetTodolistsQuery()

  if (data.isLoading) {
    return <h1>loading</h1>
  }

  return (
    <>
      {data?.data?.map((todolist: any) => (
        <Grid key={todolist.id}>
          <Paper sx={{ p: "0 20px 20px 20px" }}>
            <TodolistItem todolist={todolist} />
          </Paper>
        </Grid>
      ))}
    </>
  )
}
