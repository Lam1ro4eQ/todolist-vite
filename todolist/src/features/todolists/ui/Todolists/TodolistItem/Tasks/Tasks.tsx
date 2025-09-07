import { TaskItem } from "./TaskItem/TaskItem"
import List from "@mui/material/List"
import { DomainTodolist } from "@/features/todolists/model/todolists-slice.ts"
import { DomainTask } from "@/features/todolists/api/tasksApi.types.ts"
import { TaskStatus } from "@/common/enums"
import { useGetTasksQuery } from "@/features/todolists/api/tasksApi.ts"
import { TasksSkeleton } from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksSkeleton/TasksSkeleton.tsx"
import { useAppDispatch } from "@/common/hooks"
import { useEffect } from "react"
import { changeErrorAC } from "@/app/app-slice.ts"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist
  const dispatch = useAppDispatch()
  const { data, isLoading, error } = useGetTasksQuery(id)

  // useEffect(() => {
  //   if (!!error) {
  //     if ("status" in error) {
  //       const err = "error" in error ? error.error : JSON.stringify(error.data || "Some error occurred")
  //       dispatch(changeErrorAC({ error: err }))
  //     } else {
  //       dispatch(changeErrorAC({ error: error.message || "Some error occurred" }))
  //     }
  //   }
  // }, [error])

  if (isLoading) {
    return <TasksSkeleton />
  }

  let filteredTasks = data?.items
  if (filter === "active") {
    filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.New)
  }
  if (filter === "completed") {
    filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.Completed)
  }

  return (
    <>
      {filteredTasks && filteredTasks.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <List>
          {filteredTasks?.map((task: DomainTask) => <TaskItem key={task.id} task={task} todolist={todolist} />)}
        </List>
      )}
    </>
  )
}
