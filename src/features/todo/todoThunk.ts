import { db } from "../../app/db"
import type { Todo } from "./todo.type"
import type { TodoAction, TodoThunk } from "./todoSlice"
import { addTodo, removeTodo, reorderTodo, updateTodo } from "./todoSlice"

const addTodoThunk =
  (added: Todo): TodoThunk<Promise<void>> =>
  async dispatch => {
    const createdAt = Date.now()
    return db.todos
      .add({ ...added, createdAt, order: createdAt, id: undefined })
      .then((id: number) => {
        dispatch(addTodo({ added: { ...added, id, createdAt } }))
      })
      .catch((error: any) => {
        console.error("Failed to add todo:", error)
      })
  }

const removeTodoThunk =
  (id: number, errorHanding?: () => void): TodoThunk =>
  async (dispatch, getState) => {
    const todo = getState().todo.find(todo => todo.id === id)
    if (!todo) {
      errorHanding?.()
      return
    }

    dispatch(removeTodo({ id }))

    db.todos.delete(id).catch((error: any) => {
      console.error("Failed to remove todo:", error)
      dispatch(addTodo({ added: todo }))
      errorHanding?.()
    })
  }

const updateTodoThunk =
  (
    id: number,
    updated: Partial<Omit<Todo, "id" | "createdAt">>,
    errorHanding?: () => void,
  ): TodoThunk =>
  async (dispatch, getState) => {
    const todo = getState().todo.find(todo => todo.id === id)
    if (!todo) {
      errorHanding?.()
      return
    }
    const changedAt = Date.now()

    dispatch(updateTodo({ id, updated: { ...updated, changedAt } }))

    db.todos.update(id, { ...updated, changedAt }).catch((error: any) => {
      console.error("Failed to update todo:", error)
      dispatch(updateTodo({ id, updated: { changedAt: undefined, ...todo } }))
      errorHanding?.()
    })
  }

const reorderTodoThunk =
  (
    beforeIndex: number,
    afterIndex: number,
    id?: number,
    errorHanding?: () => void,
  ): TodoThunk =>
  async (dispatch, getState) => {
    if (beforeIndex === afterIndex) {
      errorHanding?.()
      return
    }
    const todoId = id ?? getState().todo[beforeIndex].id
    const prevId =
      getState().todo[beforeIndex > afterIndex ? afterIndex - 1 : afterIndex]
        ?.id
    const nextId =
      getState().todo[beforeIndex > afterIndex ? afterIndex : afterIndex + 1]
        ?.id
    if (todoId === undefined) {
      errorHanding?.()
      return
    }

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
      errorHanding?.()
    })
  }

const fetchTodoThunk = (): TodoThunk<Promise<void>> => dispatch =>
  db.todos
    .orderBy("order")
    .toArray()
    .then(todos => {
      const fetchTodoAction: TodoAction = {
        type: "todo/fetchTodo",
        payload: { todos },
      }
      dispatch(fetchTodoAction)
    })

export {
  addTodoThunk,
  removeTodoThunk,
  updateTodoThunk,
  reorderTodoThunk,
  fetchTodoThunk,
}
