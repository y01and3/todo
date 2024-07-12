import { useParams } from "react-router-dom"
import TodoEditor from "../components/todo/TodoEditor"
import { useAppSelector } from "../app/hooks"
import { selectTodoById } from "../features/todo/todoSelector"
import { Helmet } from "react-helmet"
import type { PageProps } from "./page.type"

const EditTodo = ({ setTitle }: PageProps) => {
  setTitle("Edit Todo")
  const id = Number(useParams<{ id: string }>()["id"])
  const todo = useAppSelector(state => selectTodoById(state, id))
  return (
    <>
      <Helmet>
        <title>Edit Todo - Todo</title>
      </Helmet>
      <TodoEditor todo={todo} />
    </>
  )
}

export default EditTodo
