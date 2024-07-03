type TodoPriority = "low" | "medium" | "high"
interface Todo {
  id: number
  tittle: string
  discription?: string
  priority: TodoPriority
  isComplete: boolean
  createdAt: number
  changedAt?: number
  expectedSpentTime?: number
  deadline?: number
  // tags?: string[]
  // subTodos?: Todo[]
}

export type { TodoPriority, Todo }
