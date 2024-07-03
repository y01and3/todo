type TodoPriority = "low" | "medium" | "high"
interface Todo {
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

interface TodoItem extends Todo {
  id: number
}


export type { TodoPriority, Todo, TodoItem }
