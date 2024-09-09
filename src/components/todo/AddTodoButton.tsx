import { FloatButton } from "antd"
import { Plus } from "iconoir-react"
import { useNavigate } from "react-router-dom"

const AddTodoButton = () => {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate("/todo/add")
  }
  return (
    <FloatButton
      type="primary"
      icon={<Plus width="1em" />}
      onClick={handleClick}
    />
  )
}

export default AddTodoButton
