import type { PayloadAction, ThunkAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import type { Todo } from "./todo.type"
import type { RootState } from "../../app/store"

export const todoSlice = createSlice({
  name: "todo",
  initialState: [] as Todo[],
  reducers: {
    addTodo: (state, action: PayloadAction<{ added: Todo }>) => {
      state.push({ ...action.payload.added })
      return state
    },
    removeTodo: (state, action: PayloadAction<{ id: number }>) =>
      state.filter(todo => todo.id !== action.payload.id),
    updateTodo: (
      state,
      action: PayloadAction<{ id: number; updated: Partial<Omit<Todo, "id">> }>,
    ) =>
      state.map(todo =>
        todo.id === action.payload.id
          ? { ...todo, ...action.payload.updated }
          : todo,
      ),
    reorderTodo: (
      state,
      action: PayloadAction<{
        beforeIndex: number
        afterIndex: number
      }>,
    ) => {
      const movedTodo = state[action.payload.beforeIndex]
      state.splice(action.payload.beforeIndex, 1)
      state.splice(action.payload.afterIndex, 0, movedTodo)
      return state
    },
    fetchTodo: (state, action: PayloadAction<{ todos: Todo[] }>) =>
      action.payload.todos,
  },
})

export const { addTodo, removeTodo, updateTodo, reorderTodo, fetchTodo } =
  todoSlice.actions
export type TodoAction = ReturnType<
  (typeof todoSlice.actions)[keyof typeof todoSlice.actions]
>
export type TodoThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  TodoAction
>
