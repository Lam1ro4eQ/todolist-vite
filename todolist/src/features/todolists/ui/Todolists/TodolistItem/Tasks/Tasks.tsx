import { TaskItem } from "./TaskItem/TaskItem"
import List from "@mui/material/List"
import { DomainTask } from "@/features/todolists/api/tasksApi.types.ts"
import { TaskStatus } from "@/common/enums"
import { useGetTasksQuery } from "@/features/todolists/api/tasksApi.ts"
import { TasksSkeleton } from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksSkeleton/TasksSkeleton.tsx"
import { useAppDispatch } from "@/common/hooks"
import { useEffect, useState } from "react"
import { changeErrorAC } from "@/app/app-slice.ts"
import { DomainTodolist } from "@/features/todolists/lib/types"
import { TasksPagination } from "./TasksPagination/TasksPagination"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist
  const dispatch = useAppDispatch()
  const [page, setPage] = useState(1)
  const { data, isLoading } = useGetTasksQuery({
    id,
    params: { page },
  })

  let filteredTasks = data?.items
  if (filter === "active") {
    filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.New)
  }
  if (filter === "completed") {
    filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.Completed)
  }

  if (isLoading) {
    return <TasksSkeleton />
  }

  return (
    <>
      {filteredTasks && filteredTasks.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <>
          <List>{filteredTasks?.map((task) => <TaskItem key={task.id} task={task} todolist={todolist} />)}</List>
          <TasksPagination totalCount={data?.totalCount || 0} page={page} setPage={setPage} />
        </>
      )}
    </>
  )
}
