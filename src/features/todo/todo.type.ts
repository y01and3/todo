type TodoPriority = "none" | "low" | "medium" | "high"
interface Todo {
  id: number
  title: string
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
