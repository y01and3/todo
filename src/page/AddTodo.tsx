import TodoEditor from "../components/todo/TodoEditor"
import { Helmet } from "react-helmet"
import type { PageProps } from "./page.type"

const AddTodo = ({ setTitle }: PageProps) => {
  setTitle("Add Todo")
  return (
    <>
      <Helmet>
        <title>Add Todo - Todo</title>
      </Helmet>
      <TodoEditor />
    </>
  )
}

export default AddTodo
