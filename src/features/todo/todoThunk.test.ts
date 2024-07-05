import { configureStore } from "@reduxjs/toolkit"
import { expect, test, vi } from "vitest"
import type { Todo } from "./todo.type"
import { todoSlice } from "./todoSlice"
import { addTodoThunk, removeTodoThunk, updateTodoThunk } from "./todoThunk"
import { db } from "./testDb"

vi.mock("../../app/db", async () => {
  const testDb = await import("./testDb")
  return testDb
})

const initialState: Todo[] = []

const createTestStore = (preloadedState = initialState) => {
  return configureStore({
    reducer: {
      todo: todoSlice.reducer,
    },
    preloadedState: {
      todo: preloadedState,
    },
  })
}

const fixedTimestamp = 1630000000000
const todoExample: Todo = {
  id: 123,
  title: "test",
  priority: "medium",
  isComplete: false,
  createdAt: fixedTimestamp,
}

afterEach(async () => {
  await db.todos.clear()
  vi.restoreAllMocks()
})

describe("addTodoThunk", () => {
  test("should add a todo", async () => {
    const store = createTestStore()

    await store.dispatch(addTodoThunk(todoExample))

    const state = store.getState().todo
    expect(state).toHaveLength(1)
  })
  test("should add a todo into db", async () => {
    const store = createTestStore()
    const createdAround = Date.now()

    store.dispatch(addTodoThunk(todoExample))

    const todoDb = await db.todos.toArray()
    expect(todoDb).toHaveLength(1)
    expect(todoDb[0].title).toBe("test")
    expect(todoDb[0].createdAt).toBeCloseTo(createdAround, -3)
  })
  test("should add a todo with a unique id", async () => {
    const store = createTestStore()

    store.dispatch(addTodoThunk(todoExample))
    store.dispatch(addTodoThunk(todoExample))

    const todoDb = await db.todos.toArray()
    expect(todoDb).toHaveLength(2)
    expect(todoDb[0].id).not.toBe(todoDb[1].id)
  })
  test("should add a todo as it in db", async () => {
    const store = createTestStore()

    store.dispatch(addTodoThunk(todoExample))

    const todoDb = await db.todos.toArray()
    const state = store.getState().todo
    expect(state[0]).toEqual({ ...todoExample, ...todoDb[0], order: undefined })
  })
  test("should not add a todo if database operation fails", async () => {
    const mockAdd = vi
      .spyOn(db.todos, "add")
      .mockRejectedValueOnce(new Error("test error"))
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementationOnce(() => {})

    const store = createTestStore()

    await store.dispatch(addTodoThunk(todoExample))

    const state = store.getState().todo
    expect(state).toHaveLength(0)
    expect(consoleError).toHaveBeenCalledWith(
      "Failed to add todo:",
      new Error("test error"),
    )

    mockAdd.mockRestore()
    consoleError.mockRestore()
  })
})

describe("removeTodoThunk", () => {
  test("should remove a todo", async () => {
    const store = createTestStore()

    await store.dispatch(addTodoThunk(todoExample))
    const id = store.getState().todo[0].id
    store.dispatch(removeTodoThunk(id))

    const state = store.getState().todo
    expect(state).toHaveLength(0)
  })
  test("should remove a todo from db", async () => {
    const store = createTestStore()

    await store.dispatch(addTodoThunk(todoExample))
    const id = store.getState().todo[0].id
    store.dispatch(removeTodoThunk(id))

    const todoDb = await db.todos.toArray()
    expect(todoDb).toHaveLength(0)
  })
  test("should not remove a todo if it does not exist", async () => {
    const store = createTestStore()

    await store.dispatch(addTodoThunk(todoExample))
    const id = store.getState().todo[0].id
    store.dispatch(removeTodoThunk(id + 1))

    const todoDb = await db.todos.toArray()
    const state = store.getState().todo
    expect(todoDb).toHaveLength(1)
    expect(state).toHaveLength(1)
  })
  test("should not remove a todo if database operation fails", async () => {
    const mockDelete = vi
      .spyOn(db.todos, "delete")
      .mockRejectedValueOnce(new Error("test error"))
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementationOnce(() => {})

    const store = createTestStore()

    await store.dispatch(addTodoThunk(todoExample))
    const id = store.getState().todo[0].id
    store.dispatch(removeTodoThunk(id))

    const todoDb = await db.todos.toArray()
    const state = store.getState().todo
    expect(todoDb).toHaveLength(1)
    expect(state).toHaveLength(1)
    expect(consoleError).toHaveBeenCalledWith(
      "Failed to remove todo:",
      new Error("test error"),
    )

    mockDelete.mockRestore()
    consoleError.mockRestore()
  })
})

describe("updateTodoThunk", () => {
  test("should update a todo", async () => {
    const store = createTestStore()

    await store.dispatch(addTodoThunk(todoExample))

    const id = store.getState().todo[0].id
    const changedAt = Date.now()

    store.dispatch(updateTodoThunk(id, { title: "updated" }))

    const state = store.getState().todo
    expect(state[0].title).toBe("updated")
    expect(state[0].changedAt).toBeCloseTo(changedAt, -3)
  })
  test("should update a todo in db", async () => {
    const store = createTestStore()

    await store.dispatch(addTodoThunk(todoExample))

    const id = store.getState().todo[0].id
    const changedAt = Date.now()

    store.dispatch(
      updateTodoThunk(id, {
        title: "updated",
      }),
    )

    const todoDb = await db.todos.toArray()
    expect(todoDb).toHaveLength(1)
    expect(todoDb[0].title).toBe("updated")
    expect(todoDb[0].changedAt).toBeCloseTo(changedAt, -3)
  })
  test("should not update a todo if it does not exist", async () => {
    const store = createTestStore()

    await store.dispatch(addTodoThunk(todoExample))

    const id = store.getState().todo[0].id
    const beforeTodoState = store.getState().todo
    const beforeTodoDb = await db.todos.toArray()

    store.dispatch(
      updateTodoThunk(id + 1, {
        title: "updated",
      }),
    )

    const todoDb = await db.todos.toArray()
    const state = store.getState().todo
    expect(state).toEqual(beforeTodoState)
    expect(todoDb).toEqual(beforeTodoDb)
  })
  test("should not update a todo if database operation fails", async () => {
    const store = createTestStore()

    await store.dispatch(addTodoThunk(todoExample))

    const id = store.getState().todo[0].id
    const beforeTodoState = store.getState().todo
    const beforeTodoDb = await db.todos.toArray()

    const mockUpdate = vi
      .spyOn(db.todos, "update")
      .mockRejectedValueOnce(new Error("test error"))
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementationOnce(() => {})

    store.dispatch(
      updateTodoThunk(id, {
        title: "updated",
      }),
    )

    const todoDb = await db.todos.toArray()
    const state = store.getState().todo
    expect(state).toEqual(beforeTodoState)
    expect(todoDb).toEqual(beforeTodoDb)
    expect(consoleError).toHaveBeenCalledWith(
      "Failed to update todo:",
      new Error("test error"),
    )

    mockUpdate.mockRestore()
    consoleError.mockRestore()
  })
})
