import type { EntityTable } from "dexie"
import Dexie from "dexie"
import type { Todo } from "../features/todo/todo.type"

interface TodoDb extends Todo {
  order: number
}

type RemoveUndefinedProperties<T> = {
  [K in keyof T]: T[K] extends undefined ? undefined : T[K]
}

type TodoDbItem = RemoveUndefinedProperties<TodoDb>

export const db = new Dexie("TodosDatabase") as Dexie & {
  todos: EntityTable<TodoDbItem, "id">
}

db.version(1).stores({ todos: "++id, title, completed, priority, &order" })
