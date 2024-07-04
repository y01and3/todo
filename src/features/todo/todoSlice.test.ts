import { configureStore } from "@reduxjs/toolkit"
import { expect, test } from "vitest"
import type { Todo } from "./todo.type"
import {
  addTodo,
  fetchTodo,
  removeTodo,
  reorderTodo,
  todoSlice,
  updateTodo,
} from "./todoSlice"

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
  id: 1,
  title: "test",
  priority: "medium",
  isComplete: false,
  createdAt: fixedTimestamp,
}

test("should add a todo", () => {
  const store = createTestStore()

  store.dispatch(addTodo({ added: todoExample }))

  const state = store.getState().todo
  expect(state).toHaveLength(1)
  expect(state[0]).toEqual(todoExample)
})

test("should remove a todo", () => {
  const initialState: Todo[] = [todoExample]
  const store = createTestStore(initialState)

  store.dispatch(removeTodo({ id: 1 }))

  const state = store.getState().todo
  expect(state).toHaveLength(0)
})

test("should update a todo", () => {
  const initialState: Todo[] = [todoExample]
  const store = createTestStore(initialState)

  store.dispatch(updateTodo({ id: 1, updated: { title: "Updated Todo" } }))

  const state = store.getState().todo
  expect(state[0]).toEqual({ ...todoExample, title: "Updated Todo" })
})

test("should reorder todos", () => {
  const initialState: Todo[] = [
    todoExample,
    { ...todoExample, id: 2 },
    { ...todoExample, id: 3 },
  ]
  const store = createTestStore(initialState)

  store.dispatch(reorderTodo({ beforeIndex: 0, afterIndex: 1 }))

  const state = store.getState().todo
  expect(state[0]).toBe(initialState[1])
  expect(state[1]).toBe(initialState[0])
})

test("should fetch todos", () => {
  const fetchedTodos: Todo[] = [
    todoExample,
    { ...todoExample, id: 2 },
    { ...todoExample, id: 3 },
  ]
  const store = createTestStore()

  store.dispatch(fetchTodo({ todos: fetchedTodos }))

  const state = store.getState().todo
  expect(state).toHaveLength(3)
  expect(state).toEqual(fetchedTodos)
})
