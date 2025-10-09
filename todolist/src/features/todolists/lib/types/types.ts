import { RequestStatus } from "@/common/types"
import { Todolist } from "../../api/todolistsApi.types"

export type FilterValues = "all" | "active" | "completed"

export type DomainTodolist = Todolist & {
  filter: FilterValues
  entityStatus: RequestStatus
}
