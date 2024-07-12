import type { Todo } from "../../features/todo/todo.type"
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  notification,
  Radio,
  Space,
  Typography,
} from "antd"
import dayjs from "dayjs"
import { useAppDispatch } from "../../app/hooks"
import { addTodoThunk, updateTodoThunk } from "../../features/todo/todoThunk"
import { useNavigate } from "react-router-dom"

type Omitted = "id" | "createdAt" | "updatedAt"
type FieldType = Omit<Todo, Omitted>

interface TodoEditorProps {
  todo?: Todo
}
const TodoEditor = ({ todo }: TodoEditorProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [form] = Form.useForm<FieldType>()
  if (todo) form.setFieldsValue(todo)

  const onFinish = (values: FieldType) => {
    if (todo) {
      dispatch(
        updateTodoThunk(todo.id, values, () => {
          form.setFieldsValue(todo)
          notification.error({
            message: "Failed to update todo",
            placement: "bottomLeft",
          })
        }),
      )
      navigate(`/todo/${todo.id}`)
    } else {
      dispatch(addTodoThunk(values))
        .then(() => form.resetFields())
        .catch(() =>
          notification.error({
            message: "Failed to create todo",
            placement: "bottomLeft",
          }),
        )
    }
  }
  return (
    <Form
      form={form}
      name="todoEditer"
      variant="filled"
      style={{ maxWidth: 600 }}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      autoComplete="off"
      onFinish={onFinish}
      scrollToFirstError
    >
      <Form.Item<FieldType>
        label="Title"
        name="title"
        rules={[{ required: true, message: "Please input todo title!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Completed"
        name="isComplete"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>

      <Form.Item<FieldType> label="Discription" name="discription">
        <Input.TextArea />
      </Form.Item>

      <Form.Item<FieldType>
        label="Priority"
        name="priority"
        getValueProps={value => ({
          value: value === "none" ? undefined : value,
        })}
        normalize={value => value || "none"}
      >
        <Radio.Group buttonStyle="solid">
          <Radio.Button value="low"> Low </Radio.Button>
          <Radio.Button value="medium"> Medium </Radio.Button>
          <Radio.Button value="high"> High </Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="Expected Spent Time">
        <Space>
          <Form.Item<FieldType>
            name="expectedSpentTime"
            noStyle
            rules={[{ type: "number", max: 99 }]}
          >
            <InputNumber />
          </Form.Item>
          <Typography>Hour</Typography>
        </Space>
      </Form.Item>

      <Form.Item<FieldType>
        label="Deadline"
        name="deadline"
        getValueProps={value => ({ value: value && dayjs(Number(value)) })}
        normalize={value => value && dayjs(value).valueOf()}
      >
        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          {todo ? "Submit" : "Create"}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default TodoEditor
