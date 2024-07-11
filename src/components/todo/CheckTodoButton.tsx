import { Button, notification } from "antd"
import { CheckSquare, XmarkSquare } from "iconoir-react"
import React from "react"
import { useAppDispatch } from "../../app/hooks"
import { updateTodoThunk } from "../../features/todo/todoThunk"

interface CheckTodoButtonProps {
  id: number
  isComplete: boolean
}
const CheckTodoButton = ({ id, isComplete }: CheckTodoButtonProps) => {
  const [complete, setComplete] = React.useState(isComplete)
  const dispatch = useAppDispatch()
  const handleClick = () => {
    const newComplete = !complete
    setComplete(newComplete)
    dispatch(
      updateTodoThunk(id, { isComplete: newComplete }, () => {
        setComplete(!newComplete)
        notification.error({
          message: "Fail to switch todo complete state",
          placement: "bottomLeft",
        })
      }),
    )
  }
  return (
    <Button
      type="text"
      size="small"
      icon={complete ? <CheckSquare /> : <XmarkSquare />}
      onClick={handleClick}
    />
  )
}

export default CheckTodoButton
