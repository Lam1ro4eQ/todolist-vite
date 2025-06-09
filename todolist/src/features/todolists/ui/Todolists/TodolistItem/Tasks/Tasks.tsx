import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { TaskItem } from "./TaskItem/TaskItem"
import List from "@mui/material/List"
import { selectTasks } from "@/features/todolists/model/tasks-selectors.ts"
import { DomainTodolist } from "@/features/todolists/model/todolists-slice.ts"
import { fetchTasks } from "@/features/todolists/model/tasks-slice.ts"
import { useEffect } from "react"
import { DomainTask } from "@/features/todolists/api/tasksApi.types.ts"
import { TaskStatus } from "@/common/enums"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const dispatch = useAppDispatch()
  const tasks = useAppSelector(selectTasks)
  const { id, filter } = todolist

  useEffect(() => {
    dispatch(fetchTasks(id))
  }, [])

  const todolistTasks = tasks[id]
  let filteredTasks = todolistTasks
  if (filter === "active") {
    filteredTasks = todolistTasks.filter((task: DomainTask) => task.status === TaskStatus.New)
  }
  if (filter === "completed") {
    filteredTasks = todolistTasks.filter((task: DomainTask) => task.status === TaskStatus.Completed)
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
