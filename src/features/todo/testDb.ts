import type { EntityTable } from "dexie"
import Dexie from "dexie"
import type { Todo } from "./todo.type"
import { indexedDB, IDBKeyRange } from "fake-indexeddb"

type Picked = "title" | "createdAt" | "changedAt"
interface TodoDb extends Pick<Todo, Picked> {
  id?: number
  order: number
}

type RemoveUndefinedProperties<T> = {
  [K in keyof T]: T[K] extends undefined ? undefined : T[K]
}

type TodoDbItem = RemoveUndefinedProperties<TodoDb>

export const db = new Dexie("TodoTestDatabase", {
  indexedDB,
  IDBKeyRange,
}) as Dexie & {
  todos: EntityTable<TodoDbItem, "id">
}

db.version(1).stores({ todos: "++id, title, &order" })
