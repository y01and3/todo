import type { EntityTable } from "dexie"
import Dexie from "dexie"
import type { Todo } from "../features/todo/todo.type"

export interface TodoItem extends Todo {
  order: number
}

export const db = new Dexie("TodosDatabase") as Dexie & {
  todos: EntityTable<TodoItem, "id">
}

db.version(1).stores({ todos: "++id, title, completed, priority, &order" })
