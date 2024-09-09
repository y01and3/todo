import TodoList from "../components/todo/TodoList"
import { useAppSelector } from "../app/hooks"
import {
  selectAllTodos,
  selectTodoByIsComplete,
} from "../features/todo/todoSelector"
import { useLocation } from "react-router-dom"
import type { RootState } from "../app/store"
import { Helmet } from "react-helmet"
import type { PageProps } from "./page.type"

const Todo = ({ setTitle }: PageProps) => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const filter = queryParams.get("filter")
  setTitle("Todo List")
  const selection = (state: RootState) =>
    filter === "not-done"
      ? selectTodoByIsComplete(state, false)
      : filter === "done"
        ? selectTodoByIsComplete(state, true)
        : selectAllTodos(state)
  const todos = useAppSelector(selection)
  return (
    <>
      <Helmet>
        <title>Todo List - Todo</title>
      </Helmet>
      <TodoList dataSource={todos} />
    </>
  )
}

export default Todo
