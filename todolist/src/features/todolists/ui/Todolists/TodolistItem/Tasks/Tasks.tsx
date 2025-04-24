import { useAppSelector } from "@/common/hooks"
import { TaskItem } from "./TaskItem/TaskItem"
import List from "@mui/material/List"
import { selectTasks } from "@/features/todolists/model/tasks-selectors.ts"
import { DomainTodolist } from "@/features/todolists/model/todolists-slice.ts"
import { Task } from "@/features/todolists/model/tasks-slice.ts"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist

  const tasks = useAppSelector(selectTasks)

  const todolistTasks = tasks[id]
  let filteredTasks = todolistTasks
  if (filter === "active") {
    filteredTasks = todolistTasks.filter((task: Task) => !task.isDone)
  }
  if (filter === "completed") {
    filteredTasks = todolistTasks.filter((task: Task) => task.isDone)
  }
  // console.log("Tasks state:", {
  //   filteredTasks,
  //   isArray: Array.isArray(filteredTasks),
  //   length: filteredTasks?.length,
  // })
  return (
    <>
      {filteredTasks && filteredTasks.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <List>{filteredTasks?.map((task: Task) => <TaskItem key={task.id} task={task} todolistId={id} />)}</List>
      )}
    </>
  )
}
