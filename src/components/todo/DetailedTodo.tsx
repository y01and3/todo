import type { DescriptionsProps } from "antd"
import { Descriptions, Button, Badge, Typography, notification } from "antd"
import type { Todo } from "../../features/todo/todo.type"
import { useAppDispatch } from "../../app/hooks"
import { removeTodoThunk } from "../../features/todo/todoThunk"
import { useNavigate } from "react-router-dom"
import CheckTodoButton from "./CheckTodoButton"

interface DetailedTodoProps {
  todo: Todo
}
const DetailedTodo = ({ todo }: DetailedTodoProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const handelDelete = () => {
    dispatch(
      removeTodoThunk(todo.id, () => {
        notification.error({
          message: "Fail to delete todo",
          placement: "bottomLeft",
        })
      }),
    )
    navigate("/todo")
  }
  const handelEdit = () => {
    navigate(`/todo/${todo.id}/edit`)
  }
  const badgeColor = {
    none: undefined,
    low: "green",
    medium: "orange",
    high: "red",
  }
  let items: DescriptionsProps["items"] = [
    {
      label: "Priority",
      children: (
        <Badge color={badgeColor[todo.priority]} text={todo.priority} />
      ),
    },
  ]
  if (todo.expectedSpentTime)
    items.push({
      label: "Expected Spent Time",
      children:
        todo.expectedSpentTime +
        " " +
        (todo.expectedSpentTime > 1 ? "Hours" : "Hour"),
    })
  if (todo.deadline)
    items.push({
      label: "Dead Line",
      children: new Date(todo.deadline).toLocaleString(),
    })
  if (todo.discription)
    items.push({
      label: "Discription",
      span: { xs: 1, sm: 2, md: 3 },
      children: todo.discription,
    })
  if (todo.changedAt)
    items.push({
      label: "Last Changed Time",
      children: new Date(todo.changedAt).toLocaleString(),
    })
  items.push({
    label: "Created Time",
    children: new Date(todo.createdAt).toLocaleString(),
  })
  return (
    <Descriptions
      bordered
      column={{ xs: 1, sm: 2, md: 3 }}
      layout="vertical"
      title={
        <Typography.Title level={2}>
          <CheckTodoButton id={todo.id} isComplete={todo.isComplete} />
          {todo.title}
        </Typography.Title>
      }
      extra={
        <>
          <Button type="primary" onClick={handelEdit}>
            Edit
          </Button>{" "}
          <Button type="primary" danger onClick={handelDelete}>
            Delete
          </Button>
        </>
      }
      items={items}
    />
  )
}

export default DetailedTodo
