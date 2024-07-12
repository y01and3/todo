import { useParams } from "react-router-dom"
import { useAppSelector } from "../app/hooks"
import { selectTodoById } from "../features/todo/todoSelector"
import DetailedTodo from "../components/todo/DetailedTodo"
import { Helmet } from "react-helmet"
import type { PageProps } from "./page.type"

const TodoDetail = ({ setTitle }: PageProps) => {
  setTitle("Todo Detail")
  const id = Number(useParams<{ id: string }>()["id"])
  const todo = useAppSelector(state => selectTodoById(state, id))
  return (
    <>
      <Helmet>
        <title>Todo Detail - Todo</title>
      </Helmet>
      {todo && <DetailedTodo todo={todo} />}
    </>
  )
}

export default TodoDetail
