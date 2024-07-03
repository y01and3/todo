import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import type { Todo, TodoItem } from "./todo.type"

export const todoSlice = createSlice({
  name: "todoList",
  initialState: [] as TodoItem[],
  reducers: {
    addTodo: (state, action: PayloadAction<{ added: Todo }>) => {
      state.push({ ...action.payload.added, id: state.length })
      return state
    },
    removeTodo: (state, action: PayloadAction<{ id: number }>) =>
      state.filter(todo => todo.id !== action.payload.id),
    updateTodo: (
      state,
      action: PayloadAction<{ id: number; updated: Partial<Todo> }>,
    ) =>
      state.map(todo =>
        todo.id === action.payload.id
          ? { ...todo, ...action.payload.updated }
          : todo,
      ),
    reorderTodo: (
      state,
      action: PayloadAction<{ id: number; afterIndex: number }>,
    ) => {
      const movedTodo = state.find(todo => todo.id === action.payload.id)
      state.splice(state.indexOf(movedTodo as TodoItem), 1)
      state.splice(action.payload.afterIndex, 0, movedTodo as TodoItem)
      return state
    },
  },
})

export const { addTodo, removeTodo, updateTodo, reorderTodo } = todoSlice.actions