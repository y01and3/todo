import { db } from "../../app/db"
import type { Todo } from "./todo.type"
import type { TodoThunk } from "./todoSlice"
import { addTodo, removeTodo, reorderTodo, updateTodo } from "./todoSlice"

const addTodoThunk =
  (added: Todo): TodoThunk =>
  async dispatch => {
    await db.todos
      .add({ ...added, order: Date.now() })
      .then((id: number) => {
        dispatch(addTodo({ added: { ...added, id } }))
      })
      .catch((error: any) => {
        console.error("Failed to add todo:", error)
      })
  }

const removeTodoThunk =
  (id: number): TodoThunk =>
  async (dispatch, getState) => {
    const todo = getState().todo.find(todo => todo.id === id)
    if (!todo) return

    dispatch(removeTodo({ id }))

    db.todos.delete(id).catch((error: any) => {
      console.error("Failed to remove todo:", error)
      dispatch(addTodo({ added: todo }))
    })
  }

const updateTodoThunk =
  (id: number, updated: Partial<Todo>): TodoThunk =>
  async (dispatch, getState) => {
    const todo = getState().todo.find(todo => todo.id === id)
    if (!todo) return

    dispatch(updateTodo({ id, updated }))

    db.todos.update(id, updated).catch((error: any) => {
      console.error("Failed to update todo:", error)
      dispatch(updateTodo({ id, updated: todo }))
    })
  }

const reorderTodoThunk =
  (beforeIndex: number, afterIndex: number, id?: number): TodoThunk =>
  async (dispatch, getState) => {
    if (beforeIndex === afterIndex) return
    const todoId = id ?? getState().todo[beforeIndex].id
    const prevId =
      getState().todo[beforeIndex > afterIndex ? afterIndex - 1 : afterIndex]?.id
    const nextId =
      getState().todo[beforeIndex > afterIndex ? afterIndex : afterIndex + 1]?.id
    if (todoId === undefined) return

    dispatch(reorderTodo({ beforeIndex, afterIndex }))

    const prevOrderPromise = db.todos.get(prevId).then(todo => todo?.order || 0)
    const nextOrderPromise = db.todos
      .get(nextId)
      .then(todo => todo?.order || Date.now())
    const [prevOrder, nextOrder] = await Promise.all([
      prevOrderPromise,
      nextOrderPromise,
    ])
    const order = (prevOrder + nextOrder) / 2
    db.todos.update(todoId, { order }).catch((error: any) => {
      console.error("Failed to reorder todos:", error)
      const curIndex = getState().todo.findIndex(todo => todo.id === todoId)
      if (curIndex !== -1)
        dispatch(
          reorderTodo({
            beforeIndex: curIndex,
            afterIndex:
              beforeIndex < getState().todo.length
                ? beforeIndex
                : getState().todo.length - 1,
          }),
        )
    })
  }

export {
  addTodoThunk,
  removeTodoThunk,
  updateTodoThunk,
  reorderTodoThunk,
}
