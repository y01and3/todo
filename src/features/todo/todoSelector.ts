import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"

const selectAllTodos = (state: RootState) => state.todo
const selectTodoLength = (state: RootState) => state.todo.length
const selectTodoById = (state: RootState, id: number) =>
  state.todo.find(todo => todo.id === id)
const selectTodoByIsComplete = (state: RootState, isComplete: boolean) =>
  state.todo.filter(todo => todo.isComplete === isComplete)
const selectTodoByDeadline = createSelector(
  [selectAllTodos, (state: RootState, deadline: number) => deadline],
  (todos, deadline) =>
    todos.filter(todo => todo.deadline && todo.deadline <= deadline),
)

export {
  selectAllTodos,
  selectTodoLength,
  selectTodoById,
  selectTodoByIsComplete,
  selectTodoByDeadline,
}
