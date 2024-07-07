import { FloatButton } from "antd"
import { Plus } from "iconoir-react"

const AddTodoButton = () => {
  return (
    <FloatButton type="primary" icon={<Plus width="1em" />} href="/todo/add" />
  )
}

export default AddTodoButton
