import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import type { ChangeEvent } from "react"
import { getListItemSx } from "./TaskItem.styles"
import { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
import { TaskStatus } from "@/common/enums"
import { DomainTodolist } from "@/features/todolists/model/todolists-slice.ts"
import { useDeleteTaskMutation, useUpdateTaskMutation } from "@/features/todolists/api/tasksApi.ts"

type Props = {
  task: DomainTask
  todolist: DomainTodolist
}

export const TaskItem = ({ task, todolist: { id: todolistId, entityStatus } }: Props) => {
  const [updateTask] = useUpdateTaskMutation()
  const [deleteTask] = useDeleteTaskMutation()

  const deleteTaskHandler = () => {
    deleteTask({ todolistId, taskId: task.id })
  }

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    const model: UpdateTaskModel = {
      status,
      title: task.title,
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
    }
    updateTask({ taskId: task.id, todolistId: todolistId, model })
  }

  const changeTaskTitle = (title: string) => {
    const model: UpdateTaskModel = {
      status: task.status,
      title,
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
    }

    updateTask({ taskId: task.id, todolistId: todolistId, model })
  }

  return (
    <ListItem sx={getListItemSx(task.status === TaskStatus.Completed)}>
      <div>
        <Checkbox
          checked={task.status === TaskStatus.Completed}
          onChange={changeTaskStatusHandler}
          disabled={entityStatus === "loading"}
        />
        <EditableSpan value={task.title} onChange={changeTaskTitle} entityStatus={entityStatus} />
        <p>{new Date(task.addedDate).toLocaleDateString()}</p>
      </div>
      <IconButton onClick={deleteTaskHandler} disabled={entityStatus === "loading"}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
