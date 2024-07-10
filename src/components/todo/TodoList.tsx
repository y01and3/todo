import React, { useContext, useMemo } from "react"
import { HolderOutlined } from "@ant-design/icons"
import type { DragEndEvent } from "@dnd-kit/core"
import { DndContext } from "@dnd-kit/core"
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button, Table } from "antd"
import type { TableColumnsType } from "antd"
import type { Todo, TodoPriority } from "../../features/todo/todo.type"
import { CheckSquare, Edit, PageRight, XmarkSquare } from "iconoir-react"
import { useAppDispatch } from "../../app/hooks"
import {
  removeTodoThunk,
  reorderTodoThunk,
  updateTodoThunk,
} from "../../features/todo/todoThunk"
import { Trash } from "iconoir-react/solid"

interface TodoListItem extends Omit<Todo, "discription" | "createdAt"> {
  createdAt: string
}

interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void
  listeners?: SyntheticListenerMap
}

const RowContext = React.createContext<RowContextProps>({})

const DragHandle = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext)
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: "move" }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  )
}

interface TitleProps {
  children: string
  priority: TodoPriority
}
const Title = ({ children, priority }: TitleProps) => {
  const color = { none: undefined, low: "green", medium: "orange", high: "red" }
  return <p style={{ margin: 0, color: color[priority] }}>{children}</p>
}

interface CompleteHandleProps {
  id: number
  isComplete: boolean
}
const CompleteHandle = ({ id, isComplete }: CompleteHandleProps) => {
  const [complete, setComplete] = React.useState(isComplete)
  const dispatch = useAppDispatch()
  const handleClick = () => {
    const newComplete = !complete
    setComplete(newComplete)
    dispatch(
      updateTodoThunk(id, { isComplete: newComplete }, () =>
        setComplete(!newComplete),
      ),
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

const EditHandle = ({ id }: { id: number }) => {
  return (
    <Button
      type="text"
      size="small"
      icon={<Edit />}
      href={`/todo/${id}/edit`}
    />
  )
}

const DeleteHandle = ({ id }: { id: number }) => {
  const dispatch = useAppDispatch()
  const handleClick = () => {
    dispatch(removeTodoThunk(id))
  }
  return (
    <Button
      type="text"
      size="small"
      danger
      icon={<Trash />}
      onClick={handleClick}
    />
  )
}

const DetailHandle = ({ id }: { id: number }) => {
  return (
    <Button
      type="text"
      size="small"
      icon={<PageRight />}
      href={`/todo/${id}`}
    />
  )
}

const columns: TableColumnsType<TodoListItem> = [
  { key: "sort", align: "center", width: 80, render: () => <DragHandle /> },
  {
    key: "isComplete",
    align: "center",
    width: 35,
    render: (_, record) => (
      <CompleteHandle id={record.id} isComplete={record.isComplete} />
    ),
  },
  {
    key: "ttile",
    title: "Title",
    dataIndex: "title",
    render: (tittle, record) => (
      <Title priority={record.priority}>{tittle}</Title>
    ),
  },
  {
    key: "detail",
    dataIndex: "id",
    align: "center",
    width: 35,
    render: id => <DetailHandle id={id} />,
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    width: 200,
    responsive: ["md"],
    render: createdAt => new Date(createdAt).toLocaleString(),
  },
  {
    key: "edit",
    dataIndex: "id",
    align: "center",
    width: 35,
    render: id => <EditHandle id={id} />,
    responsive: ["md"],
  },
  {
    key: "delete",
    dataIndex: "id",
    align: "center",
    width: 35,
    render: id => <DeleteHandle id={id} />,
    responsive: ["md"],
  },
]

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string
}

const Row = (props: RowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props["data-row-key"] })

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  }

  const contextValue = useMemo<RowContextProps>(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners],
  )

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  )
}

interface TodoListProps {
  dataSource: TodoListItem[]
}

const TodoList = ({ dataSource }: TodoListProps) => {
  const dispatch = useAppDispatch()

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const oldIndex = dataSource.findIndex(i => i.id === active.id)
      const newIndex = dataSource.findIndex(i => i.id === over?.id)
      dispatch(reorderTodoThunk(oldIndex, newIndex, dataSource[oldIndex].id))
    }
  }

  return (
    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
      <SortableContext
        items={dataSource.map(i => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <Table
          rowKey="id"
          components={{ body: { row: Row } }}
          columns={columns}
          dataSource={dataSource}
        />
      </SortableContext>
    </DndContext>
  )
}

export default TodoList
