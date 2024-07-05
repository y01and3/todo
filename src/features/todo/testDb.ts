import type { EntityTable } from "dexie"
import Dexie from "dexie"
import type { Todo } from "./todo.type"
import { indexedDB, IDBKeyRange } from "fake-indexeddb"

type Picked = "title" | "createdAt" | "changedAt"
export interface TodoItem extends Pick<Todo, Picked> {
  id?: number
  order: number
}

export const db = new Dexie("TodoTestDatabase", {
  indexedDB,
  IDBKeyRange,
}) as Dexie & {
  todos: EntityTable<TodoItem, "id">
}

db.version(1).stores({ todos: "++id, title, &order" })
